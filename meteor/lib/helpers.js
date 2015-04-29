function toRadians(x) {
     return x * (Math.PI / 180);
}

HelperFunctions = {
  haversineFormula: function(event, userLng, userLat) {
      var eventLat = event.latitude;
      var eventLong = event.longitude;

      //Haversine formula, source: http://www.movable-type.co.uk/scripts/latlong.html
      var R = 6371; // km
      var userLatRadians = toRadians(userLat);
      var eventLatRadians = toRadians(eventLat);
      var deltaLatRadians = toRadians(eventLat - userLat);
      var deltaLongRadians = toRadians(eventLong - userLng);

      var a = Math.sin(deltaLatRadians/2) * Math.sin(deltaLatRadians/2) +
        Math.cos(userLatRadians) * Math.cos(eventLatRadians) *
        Math.sin(deltaLongRadians/2) * Math.sin(deltaLongRadians/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var distance = R * c;

      return distance;
  },

  addDays: function(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  }
};

// TODO: Move this up 3 lines and check for usages
addHours = function(date, hours) {
  var result = new Date(date);
  result.setUTCHours(result.getUTCHours() + hours);
  return result;
};

// UI helpers that are called on shared code
// Provide a server stub as well
uiHelpers = {
  closeNavDropdown: function() {
    if (Meteor.isClient) {
      $(".navbar-collapse").removeClass('in').addClass("collapse");
      $(".navbar-toggle").stop().removeClass('collapsed');
    }
  }
}