Meteor.methods({

  removeImage: function(imageId) {
    return Images.remove(imageId);
  },
  removeImagesByDate: function(imageDate) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      console.log("removing images");
      Images.find().forEach(function(image) {
        if(image.metadata.submissionTime < imageDate) {
          console.log("Removed: " + image.metadata.submissionTime);
          Images.remove(image._id, function() { console.log("removed"); });
        } else {
          console.log("Skipped: " + image.metadata.submissionTime);
        }
      });
    } else {
      throw new Meteor.Error("SECURITY_ERROR", "not allowed");
    }
  },
  removeAllImages: function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Images.files.remove({});
    } else {
      throw new Meteor.Error("SECURITY_ERROR", "not allowed");
    }
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

    attributes.email = attributes.email.toLowerCase();

    var newUserId;

    if(attributes.userId) {
      Meteor.users.update(attributes.userId, {
        $set: {
          'profile.firstName': attributes.profile.firstName,
          'profile.lastName': attributes.profile.lastName,
          'profile.street1': attributes.profile.street1,
          'profile.street2': attributes.profile.street2,
          'profile.city': attributes.profile.city,
          'profile.state': attributes.profile.state,
          'profile.zip': attributes.profile.zip,
          'profile.partnerOrg': attributes.profile.partnerOrg,
          'profile.numberOfKids': attributes.profile.numberOfKids,
          'profile.race': attributes.profile.race,
          'profile.followingOrgs': attributes.profile.followingOrgs,
          'profile.role': attributes.profile.role,
          'profile.gender': attributes.profile.gender,
          'profile.medicaid': attributes.profile.medicaid,
          'profile.reducedLunch': attributes.profile.reducedLunch,
          'profile.UCBAppAccess': attributes.profile.UCBAppAccess
        }
      });
      Meteor.users.update(attributes.userId,
                          {$push: {emails: {address: attributes.email.toLowerCase()
                          }}});
      newUserId = attributes.userId;
      Accounts.setPassword(newUserId, attributes.password);
    } else {
      newUserId = Accounts.createUser({
        email: attributes.email.toLowerCase(),
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
        numberOfKids: Match.Optional(String),
        race: Match.Optional(String),
        gender: Match.Optional(String),
        medicaid: Match.Optional(String),
        reducedLunch: Match.Optional(String),
        UCBAppAccess: Match.Optional(String)
      }
    });


    attributes.email = attributes.email.toLowerCase();

    Meteor.users.update(this.userId, {
      $set: {
        'emails.0.address': attributes.email,
        'profile.firstName': attributes.profile.firstName,
        'profile.lastName': attributes.profile.lastName,
        'profile.street1': attributes.profile.street1,
        'profile.street2': attributes.profile.street2,
        'profile.city': attributes.profile.city,
        'profile.state': attributes.profile.state,
        'profile.zip': attributes.profile.zip,
        'profile.partnerOrg': attributes.profile.partnerOrg,
        'profile.numberOfKids': attributes.profile.numberOfKids,
        'profile.race': attributes.profile.race,
        'profile.followingOrgs': attributes.profile.followingOrgs,
        'profile.role': attributes.profile.role,
        'profile.gender': attributes.profile.gender,
        'profile.medicaid': attributes.profile.medicaid,
        'profile.reducedLunch': attributes.profile.reducedLunch,
        'profile.UCBAppAccess': attributes.profile.UCBAppAccess
      }
    });
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

    var eventAttributes = {
      name: attributes.description,
      eventDate: Date(),
      category: 'Admin Adding Points',
      hoursSpent: 0, //fake duration of event
      points: attributes.points,
      isPointsPerHour: false,
    };

    var doc = {
      userId: attributes.userId,
      approvalType: 'auto',
      approved: true,
      transactionDate: Date(),
      event: eventAttributes,
      category: 'Admin Adding Points',
      partnerOrg: partnerOrg,
      hoursSpent: 0, //fake duration of event
      deleteInd: false
    };

    DB.transactions.insert(doc);
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
  },

  'calcPoints': function(userId) {
    return DB.calcPointsForUser(userId);
  }
});
