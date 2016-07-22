/* global addErrorMessage */
/* global userAttributes */

function signup(error) {
  if(error) {
    sAlert.error(error.reason);
    Router.go('landing');
  } else {
    Router.go('memberHomePage');
  }
}

Template.eula.events({
  'click #next': function(e) {
    e.preventDefault();

    if ($('#accept-eula').prop('checked')) {
      Meteor.call('createNewUser', userAttributes, function(error) {
        if(error) {
          sAlert.error(error.reason);
        } else {
          if(Meteor.userId()) {
            Router.go('memberHomePage');
          } else {
            Meteor.loginWithPassword(userAttributes.email, userAttributes.password, signup);
          }
          // Let's delete this so the pw is not 
          // sitting around in plaintext
          delete userAttributes.password;
        }
      });
    } else {

      sAlert.error('Please check the box if you agree to the terms');

    }
  },

  'click #back': function(e) {
    e.preventDefault();
    Session.set('signupPage', 'collectUserDemographics');
  },
});
