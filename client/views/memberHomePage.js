Template.memberHomePage.helpers({
  'currentMemberName': function() {
    return Meteor.user().profile.name;
  }
});
Template.memberHomePage.events({
  'click #addItem': function(e) {
    e.preventDefault();
  }
});
