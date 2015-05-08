Template.memberProfile.helpers({
  member: function() {
    return Meteor.user();
  }
});

Template.memberProfile.events({
  'click #edit': function() {
    Router.go('editMemberProfile');
  },

  'click #sign-out': function(event) {
    Meteor.logout(function(error) {
      if (typeof accountsUIBootstrap3.logoutCallback === 'function') {
        accountsUIBootstrap3.logoutCallback(error);
      }
    });
  }
});
