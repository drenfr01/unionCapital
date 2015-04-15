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
        { name: regExp },
        { description: regExp }
      ]
    };
    return Events.find(selector, options).fetch();
  } else {
    return Events.find().fetch();
  }
});

SearchSource.defineSource('checkinEventsSearch', function(searchText, options) {
  var options = {
    sort: {startDate: 1},
    limit: 20
  };

  // Set the time interval
  var startDate = moment().add(-12, 'h').toDate();
  var endDate = moment().add(12, 'h').toDate();

  if( searchText && searchText.length > 0 ) {
    var regExp = buildRegExp(searchText);
    var selector = {
      $or: [
        { name: regExp, eventDate: { $gte: startDate, $lte: endDate }},
        { description: regExp, eventDate: { $gte: startDate, $lte: endDate }}
      ]
    };
    return Events.find(selector, options).fetch();
  } else {
    return Events.find({ eventDate: { $gte: startDate, $lte: endDate }}).fetch();
  }

});

function buildRegExp(searchText) {
  var parts = searchText.trim().split(' ');
  // note that \\s intrepets to \s, a single whitespace character
  return new RegExp("(" + parts.join("\\s") + ")", "ig");
}
