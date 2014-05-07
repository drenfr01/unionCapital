Template.landing.events({
  'click #loginButton': function(e) {
    e.preventDefault();
    Router.go('memberHomePage');
  },
});

