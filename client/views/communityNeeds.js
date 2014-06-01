var map;

Template.communityNeeds.rendered = function() {
  var mapOptions = {
    center: new google.maps.LatLng(42.3581, -71.0636),
    zoom: 13
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);

  activeEvents = Events.find({active: 1});
  var geocoder = new google.maps.Geocoder();

  activeEvents.forEach(function (place) {

    geocoder.geocode( { 'address': place.address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({
          position: results[0].geometry.location ,
          map: map,
          title: place.description
        });
      } else {
        addErrorMEssage('Geocode was not successful for the following reason ' +
          status);
      }
    });
  });
};

