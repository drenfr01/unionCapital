Template.communityNeeds.rendered = function() {
  var mapOptions = {
    center: new google.maps.LatLng(42.3581, -71.0636),
    zoom: 15 
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
  console.log(map);

  var marker = new google.maps.Marker({
    position: temp ,
    map: map,
    title: "My apartment"
  });
};
