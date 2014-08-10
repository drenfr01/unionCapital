Template.quickCheckIn.rendered = function() {
  Session.set('closestEvent', null);
  
  var geoOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      var userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude          
      };

      var closestEvent = closestLocation(userLocation, 
                                         Events.find({active: 1}).fetch());
      
                                   
      //TODO: magic number below, will be set eventually in admin 
      //dashboard
      if(closestEvent.distance < 0.1)  {
        Session.set('closestEvent',closestEvent.event);
      } else {
        addErrorMessage('The closest event is further than 100 m away. Please' +
                        ' move closer or Submit a Photo');
        Router.go('memberHomePage');
      }
    }, function(error) {
      addErrorMessage(error.message);
    }, geoOptions);
  } else {
    addErrorMessage('Geolocation not supported, please check in with photo');
    Router.go('takePicture');
  }
};

Template.quickCheckIn.helpers({
  'closestEvent': function() {
    return Session.get('closestEvent');
  }
});

Template.quickCheckIn.events({
  'click #closestEvent': function(e) {
  },
  'click #checkIn': function(e) {
    e.preventDefault();

    var attributes = {
      userId: Meteor.userId(),
      eventId: Session.get('closestEvent')._id,
      needsApproval: false,
      transactionDate: Date()
    };

    Meteor.call('insertTransaction', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason + ". Transferring you to more check-in options.");
        Router.go('checkIntoEvent', {eventId: null});
      } else {
        addSuccessMessage('Added points to your total!');
        Router.go('checkPoints');
      }
    });
  }
});

