Meteor.methods({

  removeImage: function(imageId) {
    return Images.remove(imageId);
  },

  insertTransaction: function(attributes) {

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

    // Uses the event's partner org if the transaction is associated with an event
    // Otherwise uses the user's partner org
    if (attributes.eventId && Events.findOne({ _id: attributes.eventId })) {
      var thisEvent = Events.findOne({ _id: attributes.eventId });
      attributes.partnerOrg = thisEvent.institution;
      attributes.pendingEventName = thisEvent.name;
      attributes.pendingEventDescription = thisEvent.description;

      // Check against max possible hours
      if (attributes.hoursSpent > thisEvent.duration)
        attributes.hoursSpent = thisEvent.duration;

    } else {
      attributes.partnerOrg = currentUser.profile.partnerOrg;
    }

    check(attributes, {
      userId: String,
      hoursSpent: Number,
      approvalType: String,
      eventId: Match.Optional(String),
      imageId: Match.Optional(String),
      approved: Boolean,
      pendingEventName: Match.Optional(String),
      pendingEventDescription: Match.Optional(String),
      category: Match.Optional(String),
      pendingEventDate: Match.Optional(Date),
      transactionDate: Match.Optional(Date),
      partnerOrg: String,
      userLat: Match.Optional(Number),
      userLng: Match.Optional(Number),
      hasUCBButton: Match.Optional(Boolean)

    });

    var duplicateTransaction = Transactions.findOne({
      userId: currentUser._id,
      imageId: attributes.imageId,
      pendingEventName: attributes.pendingEventName,
      pendingEventDescription: attributes.pendingEventDescription,
      pendingEventDate: attributes.pendingEventDate,
      eventId: attributes.eventId
    });

    //TODO: setup MAIL URL for union capital website
    if(attributes.approvalType === 'super_admin' || attributes.approvalType === 'partner_admin') {
      console.log('A Union Capitalist has submitted a photo for approval',
                  currentUser.profile.firstName + ' ' + currentUser.profile.lastName +
                    ' requests that you log onto the admin website and approve or reject their event.' +
                    ' If there is any questions they can be reached at: ' + currentUser.emails[0].address
                 );
    }

    // Check for duplicate submissions
    if(attributes.eventId && Transactions.findOne({userId: currentUser._id, eventId: attributes.eventId})) {
      throw new Meteor.Error(400, "You have already checked into this event");
    } else if (duplicateTransaction){
     throw new Meteor.Error(400, "This may be a duplicate submission");
    } else {

      // Only insert if allowed approval type - a whitelist would probably be better here
      if (attributes.approvalType !== 'not_allowed') {

        // Good to go, let's check in
        attributes.deleteInd = false;
        console.log(' 88888888  ' + attributes.imageId);
        //TODO: refactor this to a central database access layer
        var user = Meteor.users.findOne(attributes.userId);
        attributes.firstName = user.profile.firstName;
        attributes.lastName = user.profile.lastName;
        Transactions.insert(attributes);
      }

      return attributes.approvalType;
    }
  },

  insertEvents: function(attributes) {
    check(attributes, {
      point: Number
    });
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
  approveTransaction: function(attributes) {
    var eventId;

    check(attributes, {
      transactionId: String,
      userId: String,
      eventId: Match.Optional(String),
      imageId: Match.Optional(String),
      eventName: String,
      eventAddress: String,
      eventDescription: Match.Optional(String),
      category: Match.Optional(String),
      hoursSpent: Number,
      eventDate: Date,
      points: Match.Optional(Number),
      pointsPerHour: Match.Optional(Number)
    });

    // This creates a new event if the transaction isn't tied to an existing one
    // Events created in this manner are marked with the adHoc flag set to true
    if(attributes.eventId) {
      var event = Events.findOne(attributes.eventId);
      eventId = attributes.eventId;
      attributes.category = event.category;
    } else {
      attributes.active = 0;
      attributes.isPointsPerHour = false;
      eventId = DB.insertEvent(attributes);
    }

    // Update the transaction to show approved
    Transactions.update(attributes.transactionId,
                        {$set: { approved: true, eventId: eventId} });

    // Send an email to let the user know
    var user = Meteor.users.findOne(attributes.userId);
    emailHelper(user.emails[0].address,
                AppConfig.adminEmail,
                'Your Event has been approved',
                'Thanks for attending ' + attributes.eventName + "!" +
                  "You have earned " + attributes.points + " points for your service!"
               );
  },

  createNewUser: function(attributes) {
    check(attributes, {
      userId: Match.Optional(String),
      email: String,
      password: String,
      profile: {
        firstName: String,
        lastName: String,
        street1: String,
        street2: String,
        city: String,
        state: String,
        zip: String,
        partnerOrg: String,
        numberOfKids: Match.Optional(String),
        race: Match.Optional(String),
        //TODO: the IDs attached here do not correspond
        //to the actual partner org ids
        followingOrgs: Match.Optional([Object]),
        role: Match.Optional(String),
        gender: Match.Optional(String),
        medicaid: Match.Optional(String),
        reducedLunch: Match.Optional(String),
        UCBAppAccess: Match.Optional(String)
      }
    });

    var newUserId;

    if(attributes.userId) {
      Meteor.users.update(attributes.userId,
                          {$set: { profile: attributes.profile
                          }});
      Meteor.users.update(attributes.userId,
                          {$push: {emails: {address: attributes.email
                          }}});
      newUserId = attributes.userId;
      Accounts.setPassword(newUserId, attributes.password);
    } else {
      newUserId = Accounts.createUser({
        email: attributes.email,
        password: attributes.password,
        profile: attributes.profile
      });
    }

    emailHelper(attributes.email,
                AppConfig.adminEmail,
                'Thanks for Registering!',
                "We're excited to work with you! Please use the contact button in the applicaton " +
                  "if you have any trouble using the application."
               );

    emailHelper(AppConfig.adminEmail,
                AppConfig.adminEmail,
                'New User Registered',
                attributes.profile.firstName + " " + attributes.profile.lastName +
                 " has created an account! They can be reached at: " +
                 attributes.email
               );
    Roles.addUsersToRoles(newUserId, attributes.profile.role);
  },

  updateUser: function(attributes) {
    check(attributes, {
      email: String,
      profile: {
        firstName: String,
        lastName: String,
        street1: String,
        street2: String,
        city: String,
        state: String,
        zip: String,
        partnerOrg: String,
        numberOfKids: String,
        race: String,
        gender: String,
        medicaid: String,
        reducedLunch: String,
        UCBAppAccess: String
      }
    });
    Meteor.users.update(this.userId,
                        {$set: { profile: attributes.profile
                        }});
    //Note: this assumes only 1 email address
    Meteor.users.update(this.userId,
                        {$pop: {emails: {address: attributes.email
                        }}});
    Meteor.users.update(this.userId,
                        {$push: {emails: {address: attributes.email
                        }}});
  },

  geocodeAddress: function(address) {
    var myFuture = new Future();
    googlemaps.geocode(address, function(err, data) {
      if(err) {
        myFuture.throw(err);
      } else {
        myFuture.return(data.results[0].geometry);
      }
    });
    return myFuture.wait();
  },

  sendEmail: function(attributes) {
    check(attributes, {
      userId: String,
      comment: String
    });

    var currentUser = Meteor.users.findOne(attributes.userId);

    emailHelper(AppConfig.adminEmail,
                currentUser.emails[0].address,
                'A Union Capitalist has sent you a comment',
                currentUser.profile.firstName + ' ' + currentUser.profile.lastName +
                  ' says: ' + attributes.comment
               );
  },

  deleteEvent: function(eventId) {
    check(eventId, String);

    if(Transactions.findOne({eventId: eventId})) {
      throw new Meteor.Error(400, "Users have already checked into this event. Please contact technical support");
    } else {
      Events.remove(eventId);
    }
  },

  addPointsToUser: function(attributes) {
    check(attributes, {
      userId: String,
      points: Number,
      description: String
    });

    // Find the partner organization
    var partnerOrg = '';
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      partnerOrg = 'super_admin';
    } else {
      partnerOrg = Meteor.user().profile.partnerOrg;
    }

    //create new ad-hoc event for Admin adding points
    var eventAttributes = {
      eventName: attributes.description,
      eventDate: Date(),
      eventAddress: '123 Fake St, Boston, MA', //fake address
      category: 'Admin Adding Points',
      hoursSpent: 0, //fake duration of event
      points: attributes.points,
      isPointsPerHour: false,
    };

    var event = DB.insertEvent(eventAttributes);
    
    Transactions.insert({
      userId: attributes.userId,
      eventId: event,
      approvalType: 'auto',
      approved: true,
      transactionDate: Date(),
      partnerOrg: partnerOrg,
      deleteInd: false
    });

  },

  removeReservation: function(eventId) {
    check(eventId, String);

    var userId = Meteor.userId();
    var reservation = Reservations.findOne({userId: userId, eventId: eventId});

    if (reservation) {
      // These should be broken out into a method call in dataAccess
      Reservations.remove({userId: userId, eventId: eventId});
      Events.update({_id: eventId}, {$inc: {numberRSVPs: -reservation.numberOfPeople}});
    }
  },

  'getRsvpList': function(eventId) {
    check(eventId, String);
    var reservations = Reservations.getReservationsForEvent(eventId).fetch();
    //WARNING: this may not scale well, running repeated calls against db
    //I don't know if Meteor is smart enough to cache mongo cursor
    var returnValue =  _.map(reservations, function(reservation) {
      var user = Meteor.users.findOne({_id: reservation.userId});
      return {firstName: user.profile.firstName, lastName: user.profile.lastName.substring(0,1), numberOfPeople: reservation.numberOfPeople};
    });
    return returnValue;
  },

  'adminResetPassword': function(attributes) {
    check(attributes, {
      email: String,
      password: String
    });
    var user = Meteor.users.findOne({'emails': { $elemMatch: { address: attributes.email}}});
    if(user) {
      Accounts.setPassword(user._id, attributes.password);
    } else {
      throw new Meteor.Error(404, "User with that email not found");
    }
  },

  'insertMemberData': function(attributes) {

    check(attributes, {
      sortOn: String,
      sortOrder: Number
    });

    var users =  Meteor.users.find().fetch();

    var tableRows = _.map(users, function(user) {

      //WARNING: unclear if below is a big performance hit (2 cursor calls)
      var transactionCount = Transactions.find({userId: user._id}).count();
      var totalPoints = Meteor.users.totalPointsFor(user._id);
      var mostRecentTransaction = Transactions.find({userId: user._id},
                            {sort: {transactionDate: -1}, limit: 1}).fetch()[0] ||
                              { eventId: "", transactionDate: ""};
      var mostRecentEvent = Events.findOne(mostRecentTransaction.eventId) || {name: ""};

      //if user is admin
      var userProfile = user.profile || {firstName: 'admin', lastName: '', zip: ''};
      //if user is logging in with facebook
      var userFirstName = userProfile.firstName || userProfile.name || "";
      var userLastName = userProfile.lastName || userProfile.name || "";
      var userZip = userProfile.zip || "";



      return {firstName: userFirstName.toLowerCase(),
        lastName: userLastName.toLowerCase(),
        zip: userZip,
        lastEvent: mostRecentEvent.name,
        lastEventDate: mostRecentTransaction.transactionDate,
        numberOfTransactions: transactionCount,
        totalPoints: totalPoints};
    });
    var results = _.sortBy(tableRows, attributes.sortOn);
    // _.sortBy doesn't have a flag for ascending / descending
    // for some reason...
    if(attributes.sortOrder === 1) {
      return results;
    } else {
      return results.reverse();
    }
  },

  'archiveMember': function(userId) {
    check(userId, String);
    Meteor.users.update({_id: userId}, {$set: {deleteInd: true}});
  },

  'unarchiveMember': function(userId) {
    check(userId, String);
    Meteor.users.update({_id: userId}, {$set: {deleteInd: false}});
  },

  'getTopEarners': function(limit) {
    //map reduce over transactions, returning array of objects with userId & total Points
    //sort that list, and return top <limit> of results
    //populate that list as needed with other information from Users collection
    //return that array of objects

    var allEarners = [];
    Meteor.users.find().forEach(function(user) {
      allEarners.push({userId: user._id, totalPoints: parseInt(Meteor.users.totalPointsFor(user._id),10)});
    });

    //note: not sure why > or < didn't work in below comparator but "-" did...
    var results =  allEarners.sort(function(m1, m2) { return parseInt(m2.totalPoints,10) - parseInt(m1.totalPoints,10); }).slice(0,limit);

    var topEarners = [];
    results.forEach(function(earner) {
      var user = Meteor.users.findOne(earner.userId);
      if(user.profile) {
        topEarners.push({firstName: user.profile.firstName, lastName: user.profile.lastName, zip: user.profile.zip, totalPoints: earner.totalPoints});
      }
    });
    return topEarners;
  },

  'insertReservations': function(attributes) {
    check(attributes, {
      eventId : String,
      numberOfPeople: String
    });

    var user = Meteor.user();

    attributes.firstName = user.profile.firstName;
    attributes.lastName = user.profile.lastName;
    attributes.userId = user._id;
    attributes.dateEntered = new Date();

    Reservations.insert(attributes);
    Events.update({_id: attributes.eventId}, {$inc: {numberRSVPs: attributes.numberOfPeople}});
  }
});
