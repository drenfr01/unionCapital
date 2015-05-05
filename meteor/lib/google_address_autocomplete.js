// Creates the autocomplete google maps object
// componentForm should be an object passed
// with each key equal to a field ID
addressAutocomplete = { 
  
  autocomplete: null,

  // Adds an autocomplete using google places API
  initialize: function(elementId, componentForm) {
    var self = this;

    if (elementId === null) {
      console.log('Element does not exist');
    } else {
      this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(elementId), { types: ['geocode'], componentRestrictions: { country: "us"}});

      google.maps.event.addListener(this.autocomplete, 'place_changed', function() {
        self.fillInAddress(componentForm);
      });
    }
  },

  // Fills in the other address objects
  fillInAddress: function(componentForm) {

    if (componentForm === null) {
      console.log('Parameter componentForm cannot be null');
    } else {
      // Get the place details from the autocomplete object.
      var place = this.autocomplete.getPlace();

      for (var component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
      }

      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = place.address_components[i][componentForm[addressType]];
          document.getElementById(addressType).value = val;
        }
      }
    }
  },

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  geolocate: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = new google.maps.LatLng(
            position.coords.latitude, position.coords.longitude);
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        this.autocomplete.setBounds(circle.getBounds());
      });
    }
  }
}; 
