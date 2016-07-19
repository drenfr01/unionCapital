Meteor.publish('addons', function() {
  return Addons.find();
});
