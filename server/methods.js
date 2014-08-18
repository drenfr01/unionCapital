Meteor.methods({
  removeImage: function(imageId) {
    return Images.remove(imageId);
  },
  insertTransaction: function(attributes) {
    check(attributes, {
      userId: Match.Optional(String),
      eventId: Match.Optional(String),
      hoursSpent: Match.Optional(Number),
      minutesSpent: Match.Optional(Number),
      imageId: Match.Optional(String),
      needsApproval: Match.Optional(Boolean),
      pendingEventName: Match.Optional(String),
      pendingEventDescription: Match.Optional(String),
      transactionDate: Match.Optional(String) 
    });

    var currentUser = Meteor.users.findOne(attributes.userId);

    //TODO: setup MAIL URL for union capital website
    if(attributes.needsApproval) {
      emailHelper('duncanrenfrow@gmail.com',
                  'duncanrenfrow@gmail.com',
                  'A Union Capitalist has submitted a photo for approval',
                  currentUser.profile.firstName + ' ' + currentUser.profile.lastName + 
                    ' requests that you log onto the admin website and approve or reject their event.' +
                    ' If there is any questions they can be reached at: ' + currentUser.emails[0].address
                 );
    }

    console.log('Inserting Transaction!');
    console.log(attributes);
    if(attributes.eventId && Transactions.findOne({userId: attributes.userId, eventId: attributes.eventId})) {
      throw new Meteor.Error(400, "You have already checked into this event");
    } else {
      return Transactions.insert(attributes);
    }
  },
  //Note: we don't want to permanently remove any data
  //so we leave the images intact and just change the flag to false
  rejectTransaction: function(attributes) {
    check(attributes, {
      imageId: String,
      transactionId: String
    });
    removeTransaction(attributes.transactionId);
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
      imageId: String,
      eventName: String,
      eventAddress: String,
      eventDescription: String,
      eventDate: Date,
      points: Number
    });

    //this creates a new event if the transaction isn't tied to an existing one
    //Currently the only way to tell DIY events is the active flag, which 
    //isn't ideal because a regular event could be de-activated 
    if(attributes.eventId) {
      eventId = attributes.eventId;
    } else {
      attributes.active = 0;
      eventId = insertEvent(attributes);
    }
    Transactions.update(attributes.transactionId, 
                        {$set: { needsApproval: false, eventId: eventId} }); 

    var user = Meteor.users.findOne(attributes.userId);

    emailHelper(user.emails[0].address,
                'duncanrenfrow@gmail.com',
                'Your Event has been approved',
                'Thanks for attending ' + attributes.eventName + "!" +
                  "You have earned " + attributes.points + " points for your service!"
               );
  },
  createNewUser: function(attributes) {
    check(attributes, {
      email: String,
      password: String,
      profile: {
        firstName: String,
        lastName: String,
        zip: String
      }  
    });
    var newUserId = Accounts.createUser({
      email: attributes.email,
      password: attributes.password,
      profile: attributes.profile
    });

    //TODO: make this dry with updateUserProfile helper above
    emailHelper(attributes.email,
                'duncanrenfrow@gmail.com',
                'Thanks for Registering!',
                "We're excited to work with you! Please use the contact button in the applicaton " +
                  "if you have any trouble using the application."
               );

    emailHelper('duncanrenfrow@gmail.com',
                'duncanrenfrow@gmail.com',
                'New User Registered',
                attributes.profile.firstName + " " + attributes.profile.lastName + 
                 " has created an account! They can be reached at: " +
                 attributes.email
               );
    Roles.addUsersToRoles(newUserId, 'user');
  },
  updateUserProfile: function(attributes) {
    check(attributes, {
      userId: String,
      email: String,
      profile: {
        firstName: String,
        lastName: String,
        zip: String
      }  
    });
    Meteor.users.update(attributes.userId,
                        {$set: { profile: attributes.profile
                        }});
                        Meteor.users.update(attributes.userId,
                                            {$push: {emails: {address: attributes.email
                                            }}});
                                            Roles.addUsersToRoles(attributes.userId, 'user');
    //TODO: make this dry with new user helper below
    emailHelper(attributes.email,
                'duncanrenfrow@gmail.com',
                'Thanks for Registering!',
                "We're excited to work with you! Please use the contact button in the applicaton " +
                  "if you have any trouble using the application."
               );

    emailHelper('duncanrenfrow@gmail.com',
                'duncanrenfrow@gmail.com',
                'New User Registered through Facebook',
                attributes.profile.firstName + " " + attributes.profile.lastName + 
                 " has created an account! They can be reached at: " +
                 attributes.email
               );
  },
  geocodeAddress: function(address) {
    var myFuture = new Future(); 
    googlemaps.geocode(
      address, 
      function(err, data) {
        if(err) {
          myFuture.throw(error);
        } else {
          myFuture.return(data.results[0].geometry);
        }
      });

      return myFuture.wait();
  },
  geolocateUser: function(attributes) {
    console.log(attributes);
    check(attributes, {
      eventId: String,
      hoursSpent: Number,
      minutesSpent: Number,
      userId: String,
      userLong: Number,
      userLat: Number
    });

    //TODO: make this an admin configurable option
    var maxDistance = 0.1; //maximum distance in kilometers to check in
    var event = Events.findOne(attributes.eventId);
    if(Transactions.findOne({userId: attributes.userId, eventId: event._id})) {
      throw new Meteor.Error(400, "You have already checked into this event");
    }
    var distance = haversineFormula(event, attributes.userLong, attributes.userLat);
    console.log("Distance: " + distance);

    if(distance < maxDistance) {
      //TODO: consider adding user geolocation info to transaction?
      Transactions.insert({userId: attributes.userId, eventId: event._id, needsApproval: false, 
                          transactionDate: Date(), hoursSpent: attributes.hoursSpent, 
                          minutesSpent: attributes.minutesSpent
      }); 
      return "Congrats, you are within: " + distance +  " km of your event. Adding points to your total!";
    } else {
      throw new Meteor.Error(400, "You are too far away from the event" +
                             "(" + distance + " km ), please move closer and try again OR take a photo " +
                             "and submit it for manually approval");
    }
  },
  sendEmail: function(attributes) {
    check(attributes, {
      userId: String,
      comment: String
    });

    var currentUser = Meteor.users.findOne(attributes.userId);

    emailHelper('duncanrenfrow@gmail.com', 
                'duncanrenfrow@gmail.com', 
                'A Union Capitalist has sent you a comment',
                currentUser.profile.firstName + ' ' + currentUser.profile.lastName + 
                  ' says: ' + attributes.comment
               );
  }
});
