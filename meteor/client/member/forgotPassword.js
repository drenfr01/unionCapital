Template.forgotPassword.events({
  'click #submit': function(e) {
    var password = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();
    var userEmail = $("#userEmail").val();

    var attributes= {
      email: userEmail,
      password: password
    };
    
    if(password !== confirmPassword) {
      addErrorMessage("Passwords do not match!");
    } else {
      //DANGER: is this transmitted in free text on the wire???
      Meteor.call('adminResetPassword', attributes, function(error) {
        if(error) {
          addErrorMessage(error.reason);
        } else {
          addSuccessMessage("Password successfully reset! Use new password to login.");
          Session.set("loginStateVar", "loginPage");
        }
      });
    }
  },
  'click #back': function(e) {
    Router.go('login');
  }
});
