function toRadians(x) {
     return x * (Math.PI / 180);
}

haversineFormula = function(event, userLong, userLat) {
    var eventLat = event.latitude;
    var eventLong = event.longitude;

    //Haversine formula, source: http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var userLatRadians = toRadians(userLat);
    var eventLatRadians = toRadians(eventLat);
    var deltaLatRadians = toRadians(eventLat-userLat);
    var deltaLongRadians = toRadians(eventLong-userLong);

    var a = Math.sin(deltaLatRadians/2) * Math.sin(deltaLatRadians/2) +
      Math.cos(userLatRadians) * Math.cos(eventLatRadians) *
      Math.sin(deltaLongRadians/2) * Math.sin(deltaLongRadians/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = R * c;
  
    return distance;
};

addDays = function(date, days) {
  var result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
};
