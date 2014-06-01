Template.alerts.helpers({
  alerts: function() {
    return Alerts.find();
  }
});
Template.alerts.rendered = function() {
  var alert = this.data;
  if (alert) {
    Meteor.defer(function() {
      Alerts.update(alert._id, {$set: {seen: true}});
    });
  }
};
