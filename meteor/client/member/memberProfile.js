Template.memberProfile.helpers({
  memberProfile: function() {
    return Meteor.user().profile;
  }
});

Template.memberProfile.events({
  'click #edit': function() {
    Router.go('editMemberProfile');
  }
});
