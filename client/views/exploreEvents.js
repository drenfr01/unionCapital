Template.exploreEvents.events({
  'click #currentEvents': function(e) {
    e.preventDefault();
    Router.go('currentEvents');
  },
  'click #upcomingEvents': function(e) {
    e.preventDefault();
    Router.go('upcomingEvents');
  }
});
