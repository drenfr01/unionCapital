function toRadians(x) {
     return x * (Math.PI / 180);
}

Meteor.methods({
   removeImage: function(imageId) {
    return Images.remove(imageId);
   },
   updateUserPoints: function(attributes) {
     return Meteor.users.update(attributes.userId, {$inc: { 'profile.points': attributes.points }});
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
        
     return Transactions.insert(attributes);
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
     console.log(eventId);
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
        street: String,
        city: String,
        state: String
      }  
    });
    var newUserId = Accounts.createUser({
      email: attributes.email,
      password: attributes.password,
      profile: attributes.profile
    });

    Roles.addUsersToRoles(newUserId, 'user');
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
  //accepts a transactionID and a geolocation lat/lng
  //gets the eventId from transaction and then 
  //compares distance of lat long. If it's "close enough" returns true and adds points
  //if its not returns false. Calling client side function displays appropriate message
  //Note: ideally figure out how to add function to Collection
  geolocateUser: function(eventId, userLong, userLat) {
    check(eventId, String);
    check(userLong, Number);
    check(userLat, Number);
    var event = Events.findOne(eventId);

    var eventLat = event.latitude;
    var eventLong = event.longitude;

    //Haversine formula, source: http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var userLatRadians = toRadians(userLat);
    var eventLatRadians = toRadians(eventLat);
    var deltaLatRadians = toRadians(eventLat-userLat);
    var deltaLongRadians = toRadians(eventLong-userLong);

    var a = Math.sin(deltaLatRadians/2) * Math.sin(deltaLatRadians/2) +
      Math.cos(userLatRadians) * Math.cos(eventLatRadians) *
      Math.sin(deltaLongRadians/2) * Math.sin(deltaLongRadians/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
  }
});
