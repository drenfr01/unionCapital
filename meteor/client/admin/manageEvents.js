Session.set('eventTypeSelected', "current");

Template.manageEvents.rendered = function() {
  $("#current").prop('checked', true);
  Session.set("category", $("#categories").val());
  Session.set("institution", $("#institutions").val());
};

Template.manageEvents.helpers({
  institutions: function() {
    return PartnerOrgs.find();
  },
  categories: function() {
    return EventCategories.find();
  },
  events: function() {
    if(Session.equals('eventTypeSelected', "past")) {
      return Events.pastEvents(Session.get("institution"),
                              Session.get("category"));
    } else {
      return Events.currentEvents(Session.get("institution"),
                                 Session.get("category"));
    }
  },
  eventTypeSelected: function(eventType) {
    return Session.equals("eventTypeSelected", eventType);
  }
});

Template.manageEvents.events({
  'change .radio-inline': function(e) {
    Session.set('eventTypeSelected', e.target.value);
  },
  'change #institutions': function(e) {
    Session.set("institution", $("#institutions").val());
  },
  'change #categories': function(e) {
    Session.set("category", $("#categories").val());
  }
});
