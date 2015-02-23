Template.alerts.helpers({
  alerts: function() {
    return Alerts.find();
  }
});
Template.alert.rendered = function() {
  var alert = this.data;
  Meteor.setTimeout(function() {
    Alerts.remove(alert._id);
  }, 3000);
};
