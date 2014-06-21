Template.memberHomePage.helpers({
  'currentMemberName': function() {
    console.log(Meteor.user());
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
