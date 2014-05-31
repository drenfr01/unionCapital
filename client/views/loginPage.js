Template.loginPage.events({
  'click #loginSubmit': function(e) {
    e.preventDefault();
    
    var email =  $('#userEmail').val();
    var password = $('#userPassword').val();

    Meteor.loginWithPassword(email, password, function(error) {
      if(error) {
        throwError(error.reason, 'alert-danger');
        Router.go('loginPage');
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
