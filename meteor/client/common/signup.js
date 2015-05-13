userAttributes = {
  profile: {}
};

Template.signup.rendered = function() {
  Session.set('signupPage', this.data);
};

Template.signup.helpers({
  getSignupTemplate: function() {
    return Session.get('signupPage');
  }
});
