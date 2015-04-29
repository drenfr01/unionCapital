Template.memberProfile.helpers({

  memberProfile: function() {
    return Meteor.user().profile;
  },

  memberEmail: function() {
    return Meteor.user().emails[0].address;
  },

  settingPassword: function() {
    return Accounts._loginButtonsSession.get('inChangePasswordFlow');
  }
});

Template.memberProfile.events({
  'click #edit': function() {
    Router.go('editMemberProfile');
  },

  'click #change-pw': function(event) {
    event.stopPropagation();
    Accounts._loginButtonsSession.resetMessages();
    Accounts._loginButtonsSession.set('inChangePasswordFlow', true);
    Meteor.flush();
  },

  'click #sign-out': function(event) {
    Meteor.logout(function(error) {
      if (typeof accountsUIBootstrap3.logoutCallback === 'function') {
        accountsUIBootstrap3.logoutCallback(error);
      }
    });
  }
});

Template.memberProfile.rendered = function() {
  Accounts._loginButtonsSession.set('inChangePasswordFlow', false);
}