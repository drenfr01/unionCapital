Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-edit-profile': function(event) {
      $('#login-dropdown-list').removeClass('open');
      Router.go('memberProfile');
    }
});
