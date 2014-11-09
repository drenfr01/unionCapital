Session.setDefault("topEarners", []);
var numberOfTopEarners = 10;

Template.topPointsList.rendered = function() {
  console.log("Calling top earners");
  Meteor.call('getTopEarners', numberOfTopEarners, function(error, data) {
    if(error) {
      addErrorMessage(error.reason);
    } else {
      Session.set('topEarners', data);
      console.log("got data");
    }
  });
};

Template.topPointsList.helpers({
  'topEarners': function() {
    return Session.get('topEarners');
  }
});
