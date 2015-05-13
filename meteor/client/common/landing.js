Template.landing.rendered = function() {
  //TODO: this may inadvertently bounce an admin user
  //to the member home page...
  if (Meteor.userId()) {
    Router.go('memberHomePage');
  }
};

Template.landing.helpers({
  getData: function() {
    return {template: 'createNewUser'};
  }
});

Template.landing.events({

  'click #facebook': function(e) {
    e.preventDefault();
    Meteor.loginWithFacebook(function(error) {
      if(error) {
        addErrorMessage(error.reason || 'Unknown Error');
      } else {
        //Facebook logins populate profile.name
        if(_.isUndefined(Meteor.user().profile.name)) {
          console.log('Routing to home page');
          Router.go('memberHomePage');
        } else {
          console.log('Routing to facebook page');
          Router.go('signup', {template: 'createNewUser'});
        }
      }
    });
  },

  'click #loginSubmit': function(e) {
    e.preventDefault();
    var email =  $('#userEmail').val();
    var password = $('#userPassword').val();

    Meteor.loginWithPassword(email, password, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
          Router.go('adminHomePage');
        } else if (Roles.userIsInRole(Meteor.userId(), 'partnerAdmin')){
          Router.go('partnerAdminHomePage');
        } else {
          Router.go('memberHomePage');
        }
      }
    });
  }
});
