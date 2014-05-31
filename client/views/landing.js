Template.landing.rendered = function() {
  Session.set('loginStateVar', 'landingPage');
};

Template.landing.helpers({
  'loginState': function(state) {
    return Session.get('loginStateVar') === state;
  },
});

Template.landing.events({
  'click #login': function(e) {
    e.preventDefault();
    Session.set('loginStateVar', 'loginPage');
  },
  'click #signUp': function(e) {
    e.preventDefault();
    Session.set('loginStateVar', 'signUp');
  }
});

