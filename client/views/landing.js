Template.landing.rendered = function() {
  Session.set('loginStateVar', 'landingPage');
};

Template.landing.helpers({
  'loginState': function(state) {
    return Session.get('loginStateVar') === state;
  },
});

Template.landing.events({
  'click #login': function(e) {
    e.preventDefault();
    Session.set('loginStateVar', 'loginPage');
  },
  'click #signUp': function(e) {
    e.preventDefault();
    Session.set('loginStateVar', 'signUp');
  },
  /*
  'submit': function(e) {
    e.preventDefault();
    Accounts.createUser({
      email: $('#userEmail').val(),
      password: $('#userPassword').val(),
      profile: {
        name: $('#userName').val(),
        address: $('#userAddress').val()
      }
    }, function(error) {
      if(error) {
        throwError(error.reason, 'alert-danger');
      }
      throwError("Successfully Created User", 'alert-success');
      Router.go('memberHomePage');
    });
    console.log('clicked');

  } 
  */
});

