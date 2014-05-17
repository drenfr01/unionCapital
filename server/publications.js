Meteor.publish("events", function() {
  return Events.find();
});

Meteor.publish('images', function() {
  return Images.find();
});
