Template.memberProfile.helpers({
  memberProfile: function() {
    return Meteor.user().profile;
  }
});
