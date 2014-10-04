Template.memberHomePage.helpers({
  'currentMemberName': function() {
    if(Meteor.user()) {
      return Meteor.user().profile.firstName || "";
    }
  }
});
Template.memberHomePage.events({
  'click #quickCheckIn': function(e) {
    e.preventDefault();
    Router.go('quickCheckIn');
  },
  'click #takePhoto': function(e) {
    e.preventDefault();
    Router.go('submitNewEvent');
  }
});
