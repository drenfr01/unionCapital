//TODO: toRadians and haversineFormula should be removed
//This is shared between client/server because I can't block on RPC calls client side, so
//need this to be here
//used in both geoLocate user in meteor.methods server side and helpers/shortestDistance on client side
function toRadians(x) {
     return x * (Math.PI / 180);
}

// haversineFormula = function(event, userLng, userLat) {
//     var eventLat = event.latitude;
//     var eventLong = event.longitude;

//     //Haversine formula, source: http://www.movable-type.co.uk/scripts/latlong.html
//     var R = 6371; // km
//     var userLatRadians = toRadians(userLat);
//     var eventLatRadians = toRadians(eventLat);
//     var deltaLatRadians = toRadians(eventLat-userLat);
//     var deltaLongRadians = toRadians(eventLong-userLng);

//     var a = Math.sin(deltaLatRadians/2) * Math.sin(deltaLatRadians/2) +
//       Math.cos(userLatRadians) * Math.cos(eventLatRadians) *
//       Math.sin(deltaLongRadians/2) * Math.sin(deltaLongRadians/2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     var distance = R * c;

//     return distance;
// };

emailHelper = function(to, from, subject, text) {
      Email.send({
         to: to,
         from: from,
         subject: subject,
         text: text
      });
};
