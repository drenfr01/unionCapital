/* global addErrorMessage */
/* global Roles */

Template.landing.helpers({
  getData: function() {
    return {template: 'createNewUser'};
  },
});

Template.landing.events({

  'submit #loginForm': function(e) {
    e.preventDefault();

    $('#loginForm').validate({
      highlight: function(element, errorClass) {
        $(element).fadeOut(function() {
          $(element).fadeIn();
        });
      },
      rules: {
        userEmail: {
          required: true,
          email: true,
        },
        userPassword: {
          required: true,
        },
      },
    });
    var isValid = $('#loginForm').valid();

    if(!isValid) {
      addErrorMessage('Invalid entry');
    }

    var email =  $('#userEmail').val().toLowerCase();
    var password = $('#userPassword').val();

    Meteor.loginWithPassword(email, password, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
          return Router.go('adminHomePage');
        } else if (Roles.userIsInRole(Meteor.userId(), 'partnerAdmin')){
          return Router.go('partnerAdminHomePage');
        }
        return Router.go('memberHomePage');
      }
    });
  }
});
