CalendarEvents = function() {
  var self = this;

  function getEventsData(timeframe, searchString) {
    minStartDate = moment().add(AppConfig.eventCalendar[timeframe].hoursBehind, 'h').toDate();
    maxEndDate = moment().add(AppConfig.eventCalendar[timeframe].hoursAhead, 'h').toDate();

    var selector = {
      eventDate: {
        $gte: minStartDate,
        $lte: maxEndDate
      }
    };

    var options = {
      sort: { eventDate: 1 }
    };

    return _.groupBy(Events.eventsSearch(searchString, selector, options), function(doc) {
        return moment(doc.eventDate).format("MM/DD/YYYY");
      });
  }

  // Returns all past events - passes the name of the desired config field
  self.getPastEvents = function(searchString) {
    return getEventsData('past', searchString);
  };

  // Returns all future events - passes the name of the desired config field
  self.getFutureEvents = function(searchString) {
    return getEventsData('future', searchString);
  };

}
