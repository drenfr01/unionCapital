Template.memberProfile.helpers({
  memberProfile: function() {
    return Meteor.user().profile;
  },
  memberEmail: function() {
    return Meteor.user().emails[0].address;
  }
});

Template.memberProfile.events({
  'click #edit': function() {
    Router.go('editMemberProfile');
  }
});
