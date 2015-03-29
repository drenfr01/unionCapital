Template.alerts.helpers({
  alerts: function() {
    return Alerts.find();
  }
});
Template.alert.rendered = function() {
  var alert = this.data;
};
