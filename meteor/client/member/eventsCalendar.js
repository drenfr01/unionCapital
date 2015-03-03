var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};

var fields = ['name', 'description'];

EventsSearch = new SearchSource('eventsSearch', fields, options);

var getEventsData = function() {
  return EventsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>");
    },
    sort: {startDate: 1}
  });
};

Template.eventsCalendar.rendered = function() {
  EventsSearch.search("");
};

Template.eventsCalendar.helpers({
  getEvents: function() {
    return getEventsData();
  }
});

Template.eventsCalendar.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    EventsSearch.search(text);
  }, 200),
});
