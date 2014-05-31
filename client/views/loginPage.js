Template.loginPage.events({
  'click #loginSubmit': function(e) {
    e.preventDefault();
    
    console.log("Login Submitted");

    var email =  $('#userEmail').val();
    var password = $('#userPassword').val();

    Meteor.loginWithPassword(email, password, function(error) {
      if(error) {
        console.log("Throwing Error");
        throwError(error.reason, 'alert-danger');
        Router.go('loginPage');
      } else {
        console.log("Success");
        if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
          Router.go('adminHomePage');
        } else {
          Router.go('memberHomePage');
        }
      }
    });

  }
});
