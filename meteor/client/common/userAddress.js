Template.userAddress.rendered = function() {
  // Define the object that directs the autofill targets
  // Keys should match up with field IDs

  var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'short_name',
    administrative_area_level_1: 'short_name',
    //country: 'long_name',
    postal_code: 'short_name'
  };

  addressAutocomplete.initialize('inputAddress', componentForm);
};
