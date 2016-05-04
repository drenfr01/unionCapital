SearchSource.defineSource('eventsSearch', function(searchText, options) {
  //I think we overwrite options because there is both a
  //server side and client side def
  //of this method, so it either calls the client side or
  //after the timeout
  //does the server side
  var options = {
    sort: {startDate: 1},
    limit: 20
  };

  if( searchText && searchText.length > 0 ) {
    var regExp = buildRegExp(searchText);
    var selector = {
      $or: [
        { name: regExp, deleteInd: false, adHoc: false },
        { institution: regExp, deleteInd: false, adHoc: false },
        { category: regExp, deleteInd: false, adHoc: false }
      ]
    };
    return Events.find(selector, options).fetch();
  } else {
    return Events.find({
      deleteInd: false,
      adHoc: false
    }).fetch();
  }
});

SearchSource.defineSource('checkinEventsSearch', function(searchText, options) {
  var options = {
    sort: {startDate: 1},
    limit: 20
  };

  // Set the time interval - sends the start date of past events
  // up to the end date of current events for performance
  var startDate = moment().add(AppConfig.checkIn.past.hoursBehind, 'h').toDate();
  var endDate = moment().add(AppConfig.checkIn.today.hoursAhead, 'h').toDate();

  if( searchText && searchText.length > 0 ) {
    var regExp = buildRegExp(searchText);
    var selector = {
      $or: [
        { name: regExp,
          deleteInd: false,
          adHoc: false,
          eventDate: { $gte: startDate, $lte: endDate }
        },
        { description: regExp,
          deleteInd: false,
          adHoc: false,
          eventDate: { $gte: startDate, $lte: endDate }
        }
      ]
    };
    return Events.find(selector, options).fetch();
  } else {
    return Events.find({
      deleteInd: false,
      adHoc: false,
      eventDate: { $gte: startDate, $lte: endDate }
    }).fetch();
  }

});
console.log("Ending eventsSearch");
function buildRegExp(searchText) {
  var parts = searchText.trim().split(' ');
  // note that \\s intrepets to \s, a single whitespace character
  return new RegExp("(" + parts.join("\\s") + ")", "ig");
}
