userAttributes = {
  profile: {}
};

Template.signup.rendered = function() {
  Session.set('signupPage', 'createNewUser');
};

Template.signup.helpers({
  getSignupTemplate: function() {
    return Session.get('signupPage');
  }
});