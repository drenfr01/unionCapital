gmaps = {

  // Set options
  options: {
    maxZoom: 16,
    minZoom: 10
  },

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

  // User's most recent latitude nad longitude
  currentLocation: {
    lat: null,
    lng: null
  },

  // gets user's current location and executes a callback
  getCurrentLocation: function(callback) {

    var self = this;

    // Options for HTML5 navigator
    var positionOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

          // Set the current location object
          self.currentLocation.lat = position.coords.latitude;
          self.currentLocation.lng = position.coords.longitude;

          if (callback)
            callback(self.currentLocation);
        },

        // This error fires when navigator exists but encounters a problem
        function(error) {
          console.log(error.reason);
        },
        positionOptions
      );
    } else {
      // This error fires when navigator does not exist
      console.log('Could not geolocate. No navigator.');
    }
  },

  // add a marker given our formatted marker data object
  addMarker: function(marker) {
    var gLatLng = new google.maps.LatLng(marker.latitude, marker.longitude);
    var gMarker = new google.maps.Marker({
      position: gLatLng,
      map: gmaps.map,
      title: marker.title,
      // animation: google.maps.Animation.DROP,
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
    if(latLng) {

      var googleLoc = new google.maps.LatLng(latLng.lat, latLng.lng);
      gmaps.selfMarker.setPosition(googleLoc);

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
  // TODO: Add self marker to bounds calc
  // Leaving it out for now because none of the test events are nearby
  calcBounds: function() {
      var bounds = new google.maps.LatLngBounds();
      latLngLength = gmaps.latLngs.length;

      if (latLngLength > 0) {
        for (var i = 0, latLngLength; i < latLngLength; i++) {
            bounds.extend(gmaps.latLngs[i]);
        }
        gmaps.map.fitBounds(bounds);

        // Sets the max zoom - it gets a bit cramped otherwise
        gmaps.map.getZoom() > gmaps.options.maxZoom && gmaps.map.setZoom(gmaps.options.maxZoom);

        // Sets the minimum zoom level
        gmaps.map.getZoom() < gmaps.options.minZoom && gmaps.map.setZoom(gmaps.options.minZoom);
      }
  },

  // check if a marker already exists
  markerExists: function(key, val) {
    _.each(gmaps.markers, function(storedMarker) {
        if (storedMarker[key] == val)
            return true;
    });
    return false;
  },

  // Intializes the map
  initialize: function() {

    // Need to empty these out in case we reload the map or else the markers
    // will not be consistent with what is actually on the map
    gmaps.clearMarkers();
    gmaps.selfMarker = null;

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

  // Takes an array of locations with latitute and longitude as first level elements
  addMarkerCollection: function(locations) {

    gmaps.clearMarkers();

    _.forEach(locations, function(location) {
      if (location.latitude && location.longitude)
        gmaps.addMarker(location);
    });
  },

  clearMarkers: function() {
    _.forEach(gmaps.markers, function(marker) { marker.setMap(null); });
    gmaps.markers = [];
    gmaps.markerData = [];
    gmaps.latLngs = [];
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
