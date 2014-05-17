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

Template.landing.helpers({
  'isMember': function() {
    return Meteor.user();
  },
});
