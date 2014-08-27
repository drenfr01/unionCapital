Template.memberHomePage.helpers({
  'currentMemberName': function() {
    if(Meteor.user()) {
      return Meteor.user().profile.firstName;
    }
  }
});
Template.memberHomePage.events({
  'click #addItem': function(e) {
    e.preventDefault();
  },
  'click #checkIntoEvent': function(e) {
    e.preventDefault();
    Router.go('checkIntoEvent', {eventId: null});
  },
  'click #quickCheckIn': function(e) {
    e.preventDefault();
    Router.go('quickCheckIn');
  },
  'click #exploreEvents': function(e) {
    e.preventDefault();
    Router.go('exploreEvents');
  },
  'click #checkPoints': function(e) {
    e.preventDefault();
    Router.go('checkPoints');
  }
});
