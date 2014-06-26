Template.landing.rendered = function() {
  Session.set('loginStateVar', 'landingPage');
};

Template.landing.helpers({
  'loginState': function(state) {
    return Session.get('loginStateVar') === state;
  },
});

Template.landing.events({
  'click #signUp': function(e) {
    e.preventDefault();
    Session.set('loginStateVar', 'signUp');
  }
});


Template.landing.events({
  'click #loginSubmit': function(e) {
    e.preventDefault();

    var email =  $('#userEmail').val();
    var password = $('#userPassword').val();

    Meteor.loginWithPassword(email, password, function(error) {
      if(error) {
        addErrorMessage(error.reason);
        /*Router.go('landing');*/
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