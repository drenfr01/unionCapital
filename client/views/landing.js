Template.landing.events({
  'click #memberLogin': function(e) {
    e.preventDefault();
    Router.go('memberHomePage');
  },
  'click #adminLogin': function(e) {
    e.preventDefault();
    Router.go('adminHomePage');
  },
  'submit': function(e) {
    e.preventDefault();
    Accounts.createUser({
      email: $('#userEmail').val(),
      password: $('#userPassword').val(),
      profile: {
        name: $('#userName').val(),
        address: $('#userAddress').val()
      }
    }, function(error) {
      if(error) {
        throwError(error.reason, 'alert-danger');
      }
      throwError("Successfully Created User", 'alert-success');
      Router.go('memberHomePage');
    });
    console.log('clicked');

  } 
});

Template.landing.helpers({
  'isMember': function() {
    return Meteor.user();
  },
});
