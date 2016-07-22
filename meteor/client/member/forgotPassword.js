Template.forgotPassword.events({
  'click #submit': function(e) {
    var userEmail = $("#userEmail").val();
    if(R.is(String, userEmail) && userEmail !== '') {
      sAlert.success('Reset password email sent');
      Accounts.forgotPassword({email: userEmail});
    } else {
      sAlert.error('Please enter a valid email');
    }
  },
  'click #back': function(e) {
    Router.go('login');
  }
});
