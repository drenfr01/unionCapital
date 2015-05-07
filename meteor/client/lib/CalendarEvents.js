CalendarEvents = function() {
  var self = this;
  var options = {
    keepHistory: 1,
    localSearch: false
  };
  var fields = ['name', 'description'];

  var eventsSearch = new SearchSource('eventsSearch', fields, options);

  function getEventsData(timeframe) {
    minStartDate = moment().add(AppConfig.eventCalendar[timeframe].hoursBehind, 'h').toDate();
    maxEndDate = moment().add(AppConfig.eventCalendar[timeframe].hoursAhead, 'h').toDate();

    return _.chain(eventsSearch.getData({
        transform: function(matchText, regExp) {
          return matchText.replace(regExp, "<span style='color:red'>$&</span>");
        },
        sort: {eventDate: 1}
      }))
      .filter(function(doc) {
        return !!(doc.eventDate >= minStartDate && doc.eventDate <= maxEndDate );
      })
      .sortBy(function(doc) {
        return doc.eventDate;
      })
      .groupBy(function(doc) {
        return moment(doc.eventDate).format("MM/DD/YYYY");
      })
      .value();
  }

  // Returns all past events - passes the name of the desired config field
  self.getPastEvents = function() {
    return getEventsData('past');
  };

  // Returns all future events - passes the name of the desired config field
  self.getFutureEvents = function() {
    return getEventsData('future');
  };

  self.search = function(searchString) {
    eventsSearch.search(searchString);
  };
}

// var events = getEventsData();
// //Note: we could filter server side, but it seemed more flexible
// //to push all data to the client then let it handle filtering
// //We could have a "include past events" flag for the user
// var currentEvents = _.filter(events, function(event) {
//   var newEventDate = new Date(event.eventDate);
//   newEventDate.setHours(0,0,0,0);
//   var currentDate = new Date().setHours(0,0,0,0);
//   return newEventDate >= currentDate;
// });
// var eventsByDate = _.groupBy(currentEvents, function(event) {
//   return moment(event.eventDate).format("MM/DD/YYYY");
// });
// return eventsByDate;
