Template.createUser.events({
  'click #createNewUser': function(e) {
    e.preventDefault();

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
        addErrorMessage(error.reason);
      }
      addSuccessMessage("Successfully Created User");
      Router.go('memberHomePage');
    });

  }
});
