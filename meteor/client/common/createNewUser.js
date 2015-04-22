Template.createNewUser.events({
  'click #back': function(e) {
    e.preventDefault();
    Router.go('login');
  },
  'click #submit': function(e) {
    e.preventDefault();

    userAttributes.profile.firstName = $('#firstName').val();
    userAttributes.profile.lastName = $('#lastName').val();
    userAttributes.email = $('#userEmail').val();
    userAttributes.password = $('#userPassword').val();

    Session.set('signupPage','collectUserDemographics');
  },
});
