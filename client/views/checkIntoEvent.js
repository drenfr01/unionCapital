Template.checkIntoEvent.helpers({
});

Template.checkIntoEvent.events({
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
          
      }, function(error) {
        addErrorMessage(error.message);
      }, geoOptions);
    } else {
      addErrorMessage('Geolocation not supported');
    }
  }
});
