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
  }
});
