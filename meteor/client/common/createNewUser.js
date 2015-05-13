Template.createNewUser.helpers({
  //For users signing up with FB,
  //this pulls in their information
  'firstName': function() {
    return  Meteor.user() ? Meteor.user().services.facebook.first_name : null;
  },
  'lastName': function() {
    return  Meteor.user() ? Meteor.user().services.facebook.last_name : null;
  },
  'email': function() {
    return Meteor.user() ? Meteor.user().services.facebook.email : null;
  }
});

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
