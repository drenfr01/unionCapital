Template.checkIntoEvent.rendered = function() {
  Session.set('longitude', null);
  Session.set('latitude', null);
  Session.set('eventId', null);

  $('#eventSelector').prop('selectedIndex',-1);
};

Template.checkIntoEvent.helpers({
  'geolocationSuccessful': function() {
    return Session.get('longitude') && Session.get('eventId');
  },
  //TODO: make sure this is actually only active events
  'currentEvents': function() {
    return Events.find({active: 1});
  }
});

Template.checkIntoEvent.events({
  'change #eventSelector': function(e) {
    e.preventDefault();
    Session.set('eventId', $('#eventSelector option:selected').val());
  },
  'click #geoLocate': function(e) {
    e.preventDefault();
    
    var geoOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

        var str = "Latitude: " + position.coords.latitude +
          "Longitude: " + position.coords.longitude;
        console.log(str);
        $("#geoText").append(str);

        Session.set('longitude', position.coords.longitude);
        Session.set('latitude', position.coords.latitude);
          
      }, function(error) {
        addErrorMessage(error.message);
      }, geoOptions);
    } else {
      addErrorMessage('Geolocation not supported');
    }
  },
  'click #submit': function(e) {
    e.preventDefault();

    Meteor.call('geolocateUser', Session.get('eventId'), 
      Session.get('longitude'), Session.get('latitude'), 
      function(error, result) {
        if(error) {
          addErrorMessage(error.reason);
        } else {
          //TODO: give points here
          addSuccessMessage('Successfully added points!');
        }

    });
  }         
});
