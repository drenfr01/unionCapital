Template.breakScreen.events({
  'click #searchEvents': function() {
    Router.go('eventSearch');
  },
  'click #addEvent': function() {
    Router.go('addEvents');
  }
});
