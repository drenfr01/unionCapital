Template.createNewUser.events({
  'click #signIn': function(e) {
    e.preventDefault();
    Session.set('loginStateVar', 'loginPage');
  },
  'click #createNewUser': function(e) {
    e.preventDefault();

    var attributes = {
      email: $('#userEmail').val(),
      password: $('#userPassword').val(),
      profile: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        zip: $('#zip').val(),
      }
    };
    //TODO: figure out if this can be done client side only?
    Meteor.call('createNewUser', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Successfully Created User");
        Meteor.loginWithPassword(attributes.email, attributes.password,
                                 function(error) {
                                   if(error) {
                                     addErrorMessage(error.reason); 
                                     Router.go('landing');
                                   } else {
                                     Router.go('memberHomePage');
                                   }
                                 });
      }
    });
  }
});
