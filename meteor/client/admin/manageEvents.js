Session.set('eventsType', "current");

Template.manageEvents.rendered = function() {
  $("#current").prop('checked', true);
};

Template.manageEvents.helpers({
  institutions: function() {
    return PartnerOrgs.find();
  },
  categories: function() {
    return EventCategories.find();
  },
  events: function() {
    if(Session.equals('eventsType', "past")) {
      return Events.pastEvents();
    } else {
      return Events.currentEvents();
    }
  }
});

Template.manageEvents.events({
  'change .radio-inline': function(e) {
    Session.set('eventsType', e.target.value);
  }
});
