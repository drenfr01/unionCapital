Template.createUser.events({
  'click #createNewUser': function(e) {
    e.preventDefault();

    console.log('clicked');

    Accounts.createUser({
      email: $('#userEmail').val(),
      password: $('#userPassword').val(),
      profile: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        street: $('#userStreet').val(),
        city: $('#userCity').val(),
        state: $('#userState').val()
      }
    }, function(error) {
      if(error) {
        throwError(error.reason, 'alert-danger');
      }
      throwError("Successfully Created User", 'alert-success');
      Router.go('memberHomePage');
    });

  }
});
