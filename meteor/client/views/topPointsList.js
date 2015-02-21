Session.setDefault("topEarners", []);
var numberOfTopEarners = 10;

Template.topPointsList.rendered = function() {
  Meteor.call('getTopEarners', numberOfTopEarners, function(error, data) {
    if(error) {
      addErrorMessage(error.reason);
    } else {
      Session.set('topEarners', data);
    }
  });
};

Template.topPointsList.helpers({
  'topEarners': function() {
    return Session.get('topEarners');
  }
});
