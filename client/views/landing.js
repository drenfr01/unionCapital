Template.landing.rendered = function() {
  //TODO: this may inadvertently bounce an admin user
  //to the member home page...
  if (Meteor.userId()) {
    Router.go('memberHomePage');
  } else {
    Session.set('loginStateVar', 'loginPage');
  }
};

Template.landing.helpers({
  'loginState': function(state) {
    return Session.equals('loginStateVar', state);
  },
});

Template.landing.events({
  'click #signUp': function(e) {
    e.preventDefault();
    Session.set('loginStateVar', 'signUp');
  },
  'click #facebook': function(e) {
    e.preventDefault();
    Meteor.loginWithFacebook(function(error) {
      if(error) {
        addErrorMessage(error.reason || 'Unknown Error');
      } else {
        //Facebook logins populate profile.name
        if(_.isUndefined(Meteor.user().profile.name)) {
          Router.go('memberHomePage');
        } else {
          Router.go('facebookLogin');
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
        Router.go('landing');
      } else {
        if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
          Router.go('adminHomePage');
        } else {
          Router.go('memberHomePage');
        }
      }
    });
  }
});
