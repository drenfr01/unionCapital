Template.addCommunityEvents.rendered = function() {
  Session.set('addEventClicked', false);
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
  'click #addEvent': function(e) {
    e.preventDefault();
    Session.set('addEventClicked', true);
  },
  'submit': function(e) {
    e.preventDefault();
    Session.set('addEventClicked', false);
  },
  'click #cancelEvent': function(e) {
    e.preventDefault();
    Session.set('addEventClicked', false);
  },
  'click #showMap': function(e) {
    e.preventDefault();
    Session.set('showMap', true);
  },
  'click #hideMap': function(e) {
    e.preventDefault();
    Session.set('showMap', false);
  }
});
