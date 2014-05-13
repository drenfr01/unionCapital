Meteor.publish("markers", function() {
  return Markers.find();
});

Meteor.publish('images', function() {
  return Images.find();
});
