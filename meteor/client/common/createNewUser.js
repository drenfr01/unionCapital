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

    //note: this returns a Validator object which can be used
    //see docs of Jquery Validator
    $("#basicForm").validate({
      highlight: function(element, errorClass) {
        $(element).fadeOut(function() {
          $(element).fadeIn();
        });
      },
      rules: {
        firstName: {
          required: true
        },
        lastName: {
          required: true
        },
        userEmail: {
          required: true,
          email: true
        },
        userPassword: {
          required: true,
          minlength: 6
        }
      }
    });
    var isValid = $('#basicForm').valid();

    if(isValid) {
      userAttributes.profile.firstName = $('#firstName').val();
      userAttributes.profile.lastName = $('#lastName').val();
      userAttributes.email = $('#userEmail').val().toLowerCase();
      userAttributes.password = $('#userPassword').val();
      Session.set('signupPage','collectUserDemographics');
    }
  }
});
