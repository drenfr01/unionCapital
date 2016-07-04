Meteor.methods({
  insertTransaction: function(attributes) {
    check(attributes, {
      userId: String,
      hoursSpent: Number,
      eventId: Match.Optional(String),
      imageId: Match.Optional(String),
      eventName: Match.Optional(String),
      eventDescription: Match.Optional(String),
      eventDate: Match.Optional(Date),
      category: Match.Optional(String),
      userLat: Match.Optional(Number),
      userLng: Match.Optional(Number),
      addons: Match.Optional([Object])
    });

    var currentUser = Meteor.user();
    // Determines whether this transaction requires approval
    attributes.approvalType = CheckInRules.run(attributes);

    // Only set it to approved if it is auto
    if (attributes.approvalType === 'auto')
      attributes.approved = true;
    else
      attributes.approved = false;

    // If the user isn't logging an action from the past,
    // we use the server's time as the source of truth
    // We should probably figure out a better way to do this
    if (!attributes.transactionDate)
      attributes.transactionDate = new Date();

    //check to see if this is ad-hoc event
    var thisEvent = Events.findOne({ _id: attributes.eventId });
    if (attributes.eventId && thisEvent) {
      // Check against max possible hours
      if (attributes.hoursSpent > thisEvent.duration)
        attributes.hoursSpent = thisEvent.duration;

      //denormalize existing event into transaction
      attributes.event = thisEvent;
      attributes.partnerOrg = thisEvent.institution;
    } else {
      //build event for transaction, it will be ad-hoc
      attributes.event = {
        name: attributes.eventName,
        description: attributes.eventDescription,
        category: attributes.category,
        eventDate: attributes.eventDate,
        userLat: attributes.userLat,
        userLng: attributes.userLng,
        imageId: attributes.imageId
      };
      attributes.partnerOrg = currentUser.primaryPartnerOrg();
    }

    var duplicateTransaction = Transactions.findOne({
      userId: currentUser._id,
      'event.name': attributes.eventName,
      'event.description': attributes.eventDescription,
      'event.eventDate': attributes.eventDate
    });

    if(attributes.approvalType === 'super_admin' || 
      attributes.approvalType === 'partner_admin') {
      console.log('A Union Capitalist has submitted a photo for approval',
                  currentUser.profile.firstName + ' ' + currentUser.profile.lastName +
                    ' requests that you log onto the admin website and approve or reject their event.' +
                    ' If there is any questions they can be reached at: ' + currentUser.emails[0].address
                 );
    }

    // Check for duplicate submissions
    if(attributes.eventId !== 'new' && Transactions.findOne({userId: currentUser._id, eventId: attributes.eventId})) {
      throw new Meteor.Error(400, "You have already checked into this event");
    } else if (duplicateTransaction){
      throw new Meteor.Error(400, "This may be a duplicate submission");
    } else {

      // Only insert if allowed approval type - 
      // a whitelist would probably be better here
      if (attributes.approvalType !== 'not_allowed') {

        // Good to go, let's check in
        attributes.deleteInd = false;
        //TODO: refactor this to a central database access layer
        var user = Meteor.users.findOne(attributes.userId);
        attributes.firstName = user.profile.firstName;
        attributes.lastName = user.profile.lastName;
        DB.transactions.insert(attributes);
      }

      return attributes.approvalType;
    }
  },
  
  //Note: we don't want to permanently remove any data
  //so we leave the images intact and just change the flag to false
  rejectTransaction: function(attributes) {
    check(attributes, {
      imageId: Match.Optional(String),
      transactionId: String
    });
    DB.removeTransaction(attributes.transactionId);
    //TODO: mark images as logically deleted
  },

  //This approves photos for existing events as well as
  //"DIY" events
  approveTransaction: function(transactionId, points) {
    check(transactionId, String);
    check(points, Number);
    var transaction = Transactions.findOne(transactionId);

    if (!transaction)
      throw new Meteor.Error('BAD_ID', 'No transaction found for this ID');

    // members shouldn't be approving transactions
    if (!Roles.userIsInRole(Meteor.userId(), ['admin','partnerAdmin']))
      throw new Meteor.Error('UNAUTHORIZED_ACTION', 'Invalid credentials for transaction approval');

    // Approve it!
    DB.transactions.approve(transactionId, points);

    // Send an email to let the user know
    var user = Meteor.users.findOne(transaction.userId);
    emailHelper(user.emails[0].address,
                AppConfig.adminEmail,
                "You've earned points!",
                'Thank you for attending ' + transaction.event.name +  ". " +
                  "You have earned " + points + " points for your community engagement!"
               );
  },
});
