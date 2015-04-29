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
  },

  'click #sign-out': function(event) {
    Meteor.logout(function(error) {
      if (typeof accountsUIBootstrap3.logoutCallback === 'function') {
        accountsUIBootstrap3.logoutCallback(error);
      }
    });
  }
});
