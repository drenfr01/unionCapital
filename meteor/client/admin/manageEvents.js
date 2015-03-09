//TODO: this is duplicate code from eventsCalendar
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};

var fields = ['name', 'description'];

EventsSearch = new SearchSource('eventsSearch', fields, options);

var getEventsData = function() {
  return EventsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<span style='color:red'>$&</span>");
    },
    sort: {startDate: 1}
  });
};

Session.set('eventTypeSelected', "current");

Template.manageEvents.rendered = function() {
  $("#current").prop('checked', true);
  Session.set("category", $("#categories").val());
  Session.set("institution", $("#institutions").val());
  EventsSearch.search("");
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
    } else if (Session.equals('eventTypeSelected', "current")){
      return Events.currentEvents(Session.get("institution"),
                                 Session.get("category"));
    } else { //user is using search bar
      var events = getEventsData();
      var eventsByDate = _.groupBy(events, function(event) {
        return moment(event.startDate).format("YYYY MM DD");
      });
      return eventsByDate;
    }
  },
  eventTypeSelected: function(eventType) {
    return Session.equals("eventTypeSelected", eventType);
  }
});

Template.manageEvents.events({
  'change .radio-inline': function(e) {
    Session.set('eventTypeSelected', e.target.value);
    $("#search-box").val("");
  },
  'change #institutions': function(e) {
    Session.set("institution", $("#institutions").val());
  },
  'change #categories': function(e) {
    Session.set("category", $("#categories").val());
  },
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    if(text) {
      Session.set("eventTypeSelected", "searching");
      EventsSearch.search(text);
    } else {
      Session.set("eventTypeSelected", "current");
      $("#current").prop('checked', true);
    }
  }, 200),
});
