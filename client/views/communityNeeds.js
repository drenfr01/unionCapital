var map;

Template.communityNeeds.rendered = function() {

  var geoOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      var mapOptions = {
        center: new google.maps.LatLng(position.coords.latitude, 
                                       position.coords.longitude),
        zoom: 13
      };
      map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

        //set start of week date
        var currentDate = new Date();
        currentDate.setHours(0,0,0,0);
        var startDayDate = new Date(currentDate);

        //set end of week date
        currentDate = new Date();
        currentDate.setHours(23,59,59,59);
        var endDayDate = new Date(currentDate);

        activeEvents = Events.find({startDate: {'$lte': endDayDate}, 
                         endDate: {'$gte': startDayDate}, 
                         active: 1},
                         {sort: {startDate: 1}});
     
      var geocoder = new google.maps.Geocoder();

      activeEvents.forEach(function (place) {

        geocoder.geocode( { 'address': place.address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var infowindow = new google.maps.InfoWindow({
              content: "Name: " + place.name
            });

            var marker = new google.maps.Marker({
              position: results[0].geometry.location ,
              map: map,
              title: place.name
            });

            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map,marker);
            });
        } else {
          addErrorMEssage('Geocode was not successful for the following reason ' +
            status);
        }
      });
    });

    }, function(error) {
      addErrorMessage(error.message);
    }, geoOptions);
  } else {
    addErrorMessage('Geolocation not supported, could not center map');
  }
};

