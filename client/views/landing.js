Template.landing.events({
  'click #memberLogin': function(e) {
    e.preventDefault();
    Router.go('memberHomePage');
  },
  'click #adminLogin': function(e) {
    e.preventDefault();
    Router.go('adminHomePage');
  },
});

