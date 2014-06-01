Template.addCommunityEvents.rendered = function() {
  Session.set('showMap', false);
};

Template.addCommunityEvents.helpers({
  'addEventClicked': function() {
    return Session.get('addEventClicked');
  },
  'showMapClicked': function() {
    return Session.get('showMap');
  }
});

Template.addCommunityEvents.events({
  'click #showMap': function(e) {
    e.preventDefault();
    Session.set('showMap', true);
  },
  'click #hideMap': function(e) {
    e.preventDefault();
    Session.set('showMap', false);
  }
});
