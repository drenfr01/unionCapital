Template.eula.helpers({
});

Template.eula.events({
  'click #next': function(e) {
    e.preventDefault();

    if ($('#accept-eula').prop('checked')) {

      // Create the user and route to the member home page
      Meteor.call('createNewUser', userAttributes, function(error) {
        if(error) {
          addErrorMessage(error.reason);
        } else {
          Meteor.loginWithPassword(userAttributes.email, userAttributes.password, function(error) {
            if(error) {
              addErrorMessage(error.reason);
              Router.go('landing');
            } else {
              Router.go('memberHomePage');
            }

            // Let's delete this so the pw is not sitting around in plaintext
            delete userAttributes.password;
          });
        }
      });

    } else {

      addErrorMessage('Please check the box if you agree to the terms');

    }
  },

  'click #back': function(e) {
    e.preventDefault();
    Session.set('signupPage', 'collectUserDemographics');
  }
})