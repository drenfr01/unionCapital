Template.landing.rendered = function() {
  Session.set('loginStateVar', 'loginPage');
};

Template.landing.helpers({
  'loginState': function(state) {
    return Session.get('loginStateVar') === state;
  },
});

Template.landing.events({
  'click #signIn': function(e) {
    e.preventDefault();
    Session.set('loginStateVar', 'loginPage');
  },
  'click #signUp': function(e) {
    e.preventDefault();
    Session.set('loginStateVar', 'signUp');
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
  },
  'click #createNewUser': function(e) {
    e.preventDefault();

    var attributes = {
      email: $('#userEmail').val(),
      password: $('#userPassword').val(),
      profile: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        street: $('#userStreet').val(),
        city: $('#userCity').val(),
        state: $('#userState').val()
      }
    };
    Meteor.call('createNewUser', attributes, function(error, result) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Successfully Created User");
        Meteor.loginWithPassword(result.email, result.password, 
          function(error) {
            addErrorMessage(error.reason);
          }
         );
        Router.go('memberHomePage');
      }
    });

  }
});

