gmaps = {

  // map object
  map: null,

  // google markers objects
  markers: [],

  // google lat lng objects
  latLngs: [],

  // our formatted marker data objects
  markerData: [],

  // self marker
  selfMarker: null,

  // gets user's current location and executes a callback
  getCurrentLocation: function(callback) {

    // Options for HTML5 navigator
    var positionOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

          // Set the current location object
          var currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          callback(currentLocation);
        },
        
        // This error fires when navigator exists but encounters a problem
        function(error) { 
          console.log(error.reason);
        },
        positionOptions
      );
    } else {

      // This error fires when navigator does not exist
      console.log('Could not geolocate. No navigator.')
    }
  },

  // add a marker given our formatted marker data object
  addMarker: function(marker) {
    var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
    var gMarker = new google.maps.Marker({
      position: gLatLng,
      map: gmaps.map,
      title: marker.title,
      animation: google.maps.Animation.DROP,
      icon: marker.icon
    });

    gmaps.latLngs.push(gLatLng);
    gmaps.markers.push(gMarker);
    gmaps.markerData.push(marker);
    return gMarker;
  },

   // Add or reset the position of the self marker
  addSelfMarker: function(latLng) {

    // Create the marker if it does not exist
    if (!gmaps.selfMarker)
      gmaps.selfMarker = new google.maps.Marker({
        clickable: false,
        icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                        new google.maps.Size(22,22),
                                                        new google.maps.Point(0,18),
                                                        new google.maps.Point(11,11)),
        shadow: null,
        zIndex: 999,
        map: gmaps.map
      });

    // If latLng was passed as an argument, use that
    // the option to pass an argument was done to avoid two consecutive navigation calls
    // in the intialize() method
    if(latLng) {
      gmaps.selfMarker.setPosition(latLng);
    } else {

      if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
          var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          gmaps.selfMarker.setPosition(me);
      }, function(error) {
          console.log("Unable to geolocate");
      });
    }
  },

  // calculate and move the bound box based on our markers
  calcBounds: function() {
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0, latLngLength = gmaps.latLngs.length; i < latLngLength; i++) {
          bounds.extend(gmaps.latLngs[i]);
      }
      gmaps.map.fitBounds(bounds);
  },

  // calculate and move the bound box based on our markers
  calcBounds: function() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, latLngLength = gmaps.latLngs.length; i < latLngLength; i++) {
      bounds.extend(gmaps.latLngs[i]);
    }
    this.map.fitBounds(bounds);
  },

  // check if a marker already exists
  markerExists: function(key, val) {
    _.each(gmaps.markers, function(storedMarker) {
        if (storedMarker[key] == val)
            return true;
    });
    return false;
  },

  // intialize the map
  initialize: function() {
    console.log("[+] Intializing Google Maps...");

    gmaps.getCurrentLocation(gmaps.createNewMap);
    
  },

  // Creates a new instance of google maps using the lat and lng passed to it
  createNewMap: function(latLng) {

    // Settings for google maps
    // Disable all options when not fullscreen
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(Meteor.user().profile.latitude, Meteor.user().profile.longitude),
        disableDefaultUI: true,
        draggable: false,
        keyboardShortcuts: false,
        mapTypeControl: false,
        scaleControl: false,
        scrollwheel: false,
        navigationControl: false,
        streetViewControl: false,
        disableDoubleClickZoom: true
    };

    mapOptions.center = new google.maps.LatLng(latLng.lat, latLng.lng);

    gmaps.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    gmaps.addSelfMarker(latLng);
  },

  // Resize the map appropriately
  // resize: function() {

  //   // Should look into a more permanent solution using bootstrap properly
	 //  var height = $(window).height() - $('#map-canvas').offset().top;
	  // var width = $(window).width();

	  // $('#map-canvas').offset({ left: 0 });
	  // $('#map-canvas').height(height);
	  // $('#map-canvas').width(width);
  // 	google.maps.event.trigger(gmaps.map,'resize');
  // },

  // Centers the map on current location using HTML5 geolocation
  // Doesn't work well
  centerMap: function() {

    gmaps.getCurrentLocation(function(latLng) {

      googleLoc = new google.maps.LatLng(latLng.lat, latLng.lng);
      gmaps.map.setCenter(googleLoc);
      console.log('Centering based on current location...');

    });
  }
}
