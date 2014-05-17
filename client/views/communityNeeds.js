Template.communityNeeds.rendered = function() {
  var mapOptions = {
    center: new google.maps.LatLng(42.3581, -71.0636),
    zoom: 15 
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
  console.log(map);

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
        throwError('Geocode was not successful for the following reason ' +
          status, "alert-danger");
      }
    });
  });
};
