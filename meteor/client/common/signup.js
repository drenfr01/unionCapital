userAttributes = {
  profile: {}
};

Template.signup.rendered = function() {
  console.log(this);
  Session.set('signupPage', this.data);
};

Template.signup.helpers({
  getSignupTemplate: function() {
    return Session.get('signupPage');
  }
});
