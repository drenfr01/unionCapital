Template.createNewUser.events({
  'click #back': function(e) {
    e.preventDefault();
    Router.go('login');
  },
  'click #submit': function(e) {
    e.preventDefault();
    Session.set("profile", {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#userEmail').val(),
        password: $('#userPassword').val()
    });
    Router.go('collectUserDemographics');
  },
});
