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

//This returns a multiplier to use for calculating the total points
//for a points per hour event
totalHours = function(hours, minutes) {
  var hoursFraction = minutes / 60;
  return hours + hoursFraction;
};

eventCategories = 
  ['Education (Child/Adult)',
    'Health (Physical & Mental)',
    'Finances/Employment',
    'Community & Service'
  ];

institutions = 
  ['BMC Health Net Plan',
    'Codman Academy',
    'Codman Health Center',
    'FII',
    'Kipp Boston',
    'Nurtury',
    'Thrive in 5',
    'Other'
];
