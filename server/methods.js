Meteor.methods({
  removeImage: function(imageId) {
    return Images.remove(imageId);
  },
  insertTransaction: function(attributes) {
    check(attributes, {
      userId: Match.Optional(String),
      eventId: Match.Optional(String),
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
  insertEvents: function(attributes) {
    check(attributes, {
      point: Number
    });
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
  //TODO: change this to DIY transaction
  approveTransaction: function(attributes) {
    check(attributes, {
      transactionId: String,
      userId: String,
      imageId: String,
      eventName: String,
      eventAddress: String,
      eventDescription: String,
      eventDate: Date,
      points: Number
    });

    var eventId = insertEvent(attributes);
    Transactions.update(attributes.transactionId, 
                        {$set: { needsApproval: false, eventId: eventId} }); 
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
  geolocateUser: function(eventId, userLong, userLat, userId) {
    check(eventId, String);
    check(userLong, Number);
    check(userLat, Number);

    //TODO: make this an admin configurable option
    var maxDistance = 0.1; //maximum distance in kilometers to check in
    var event = Events.findOne(eventId);
    if(Transactions.findOne({userId: userId, eventId: event._id})) {
      throw new Meteor.Error(400, "You have already checked into this event");
    }
    var distance = haversineFormula(event, userLong, userLat);
    console.log("Distance: " + distance);

    if(distance < maxDistance) {
      //TODO: consider adding user geolocation info to transaction?
      Transactions.insert({userId: userId, eventId: event._id, needsApproval: false, 
                          transactionDate: Date() }); 
                          Meteor.users.update(userId, {$inc: { 'profile.points': event.points }});
                          return "Congrats, you are within: " + distance +  " km of your event. Adding " + event.points + " points to your total!";
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
