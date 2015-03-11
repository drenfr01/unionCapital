
// Define configuration values. This is probably not a good place to do it
// we'll want to move this to the server
var checkinPeriod = {
  startDate: moment().subtract(3, 'years'),
  endDate: moment().add(3, 'years')
};

// Event search setup
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};
var fields = ['name', 'description'];

CheckinEventsSearch = new SearchSource('eventsSearch', fields, options);

// Gets the data for use in the getEvents helper
// Returns the selected row or returns the filtered list if none selected
var getEventsData = function() {
  var events = CheckinEventsSearch.getData({
    // transform: function(matchText, regExp) {
    //   return matchText;
    // },
    sort: {eventDate: 1}
  });

  if (Session.get('selectedEvent')) {
    
    // If there is an event selected, it narrows the list to only that event
    return _.where(events, { _id: Session.get('selectedEvent') });

  } else {

    // Otherwise, check that the end date of the even is before the start date of the check in period
    // AND the start date of the event is before the end of the check in period
    return _.filter(
      events, 
      function(event) {
        return moment(event.endDate).isAfter(checkinPeriod.startDate)
          && moment(checkinPeriod.endDate).isAfter(event.startDate);
      });
  }
};

// Handles all configuration based on if an event is selected
Tracker.autorun(function() {
  if (Session.get('selectedEvent')) {
    $('#searchDiv').hide();
    $('#checkIntoEventDiv').show();
  } else {
    $('#searchDiv').show();
    $('#checkIntoEventDiv').hide();
  }
});

// -----------------------------------------------------------------

Template.checkIntoEvent.created = function () {
  gmaps.initialize();
};

Template.checkIntoEvent.rendered = function() {
  
  // We don't want to start out with an event selected
  Session.set('selectedEvent', null);

  // Populate the event list on load
  CheckinEventsSearch.search('');

};

Template.checkIntoEvent.helpers({
  
  'getEvents': function() {
    return getEventsData();
  },

  'eventSelectText': function() {
    if (Session.get('selectedEvent'))
      return 'Cancel';
    else
      return 'Select';
  }

});

Template.checkIntoEvent.events({

  // Automatically populates the search list on keyup
  'keyup #eventSearchBox': _.throttle(function(e) {
    CheckinEventsSearch.search($('#eventSearchBox').val().trim());
  }, 200),

  'click .in button': function(e) {
    if (Session.get('selectedEvent'))
      Session.set('selectedEvent', null);
    else
      Session.set('selectedEvent', $(e.target).attr('id'));
  },


  //--------------
  'click #checkInByPhoto': function(e) {
    e.preventDefault();

    Router.go('takePicture', {_id: Session.get('eventId')});
  },
  'click #cancel': function(e) {
    Session.set('eventId', null);
    Session.set('longitude', null);
    Session.set('latitude', null);
  },
  'click #submit': function(e) {
    e.preventDefault();

    var attributes = {
      userId: Meteor.userId(),
      eventId: Session.get('eventId'),
      userLong: Session.get('longitude'),
      userLat: Session.get('latitude'),
      hoursSpent: parseInt($('#hours').val(),10),
      minutesSpent: parseInt($('#minutes').val(),10),
    };

    Meteor.call('geolocateUser', attributes,
      function(error, result) {
        if(error) {
          addErrorMessage(error.reason);
          Session.set('longitude', null);
          Session.set('latitude', null);
          Session.set('eventId', null);
        } else {
          addSuccessMessage(result);
          Router.go('checkPoints');
        }

    });
  }         
});
