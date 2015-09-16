// Definte variables need to the reactive search
var searchText = new ReactiveVar();
var options = { sort: { eventDate: 1 }}

// var eventButtonToggle = new ReactiveVar({ eventSelectText: '', eventSelectClass: '' });

// Handles all configuration based on if an event is selected
// function setToggleValues() {
//   if (Session.get('selectedEvent')) {

//     // Event selected
//     $('#searchDiv').hide();
//     $('#checkIntoEventDiv').show();

//     eventButtonToggle.set({
//       eventSelectText: 'Cancel',
//       eventSelectClass: 'btn-default'
//     });

//   } else {

//     // No event selected
//     $('#searchDiv').show();
//     $('#checkIntoEventDiv').hide();

//     eventButtonToggle.set({
//       eventSelectText: 'Select',
//       eventSelectClass: 'btn-primary'
//     });

//   }
// }

// Runs the function every time the session var changes
// Tracker.autorun(function() {
//   setToggleValues();
// });

// Sets the map markers
// This is called in the helper function and is throttled for performance
var setMapMarkers = _.debounce(function(eventsArray) {

  if (eventsArray && gmaps.map) {
    gmaps.addMarkerCollection(eventsArray);
    gmaps.calcBounds();
  }

}, 1000);

// -----------------------------------------------------------------

Template.checkIntoEvent.created = function () {
  gmaps.initialize();
};

Template.checkIntoEvent.rendered = function() {

  // We don't want to start out with an event selected
  // Session.set('selectedEvent', null);

  // Default timeframe
  Session.set('eventTimeframe', 'current');
  // setToggleValues();
  searchText.set($('#eventSearchBox').val().trim());
};

Template.checkIntoEvent.helpers({

  'getEvents': function() {
    var selector = {};

    if (Session.equals('eventTimeframe', 'current')) {
      selector.eventDate = {
        $gte: moment().add(AppConfig.checkIn.today.hoursBehind, 'h').toDate(),
        $lte: moment().add(AppConfig.checkIn.today.hoursAhead, 'h').toDate()
      };
    } else {
      selector.eventDate = {
        $gte: moment().add(AppConfig.checkIn.past.hoursBehind, 'h').toDate(),
        $lte: moment().add(AppConfig.checkIn.past.hoursAhead, 'h').toDate()
      };
    }

    var eventsArray = Events.eventsSearch(searchText.get(), selector, options);

    // TODO: find a better way to do this
    // Shouldn't have a side effect in a template helper
    setMapMarkers(eventsArray);

    return eventsArray;
  },

  // 'eventSelectText': function() {
  //   return eventButtonToggle.get().eventSelectText;
  // },

  // 'eventSelectClass': function() {
  //   return eventButtonToggle.get().eventSelectClass;
  // },

  // Disables the accordion when there is a selected event
  // 'dataToggle': function() {
  //   return Session.get('selectedEvent') ? '' : 'collapse';
  // }

});

Template.checkIntoEvent.events({

  // Automatically populates the search list on keyup
  'keyup #eventSearchBox': _.throttle(function(e) {
    searchText.set($('#eventSearchBox').val().trim());
  }, 100),

  // 'click .in button': function(e) {
  //   $(e.target).blur();

  //   if (Session.get('selectedEvent'))
  //     Session.set('selectedEvent', null);
  //   else
  //     Session.set('selectedEvent', $(e.target).attr('id'));
  // },

  'click .check-in-button': function(e) {
    e.preventDefault();

    var id = this._id
    id && Router.go('eventCheckinDetails', {id: id} );
  },

  'click #clearBtn': function() {
    // CheckinEventsSearch.search('');
    searchText.set('');
    $('#eventSearchBox').val('');
  },

  'click #pastOrCurrentRdoDiv': function(e) {
    // Session.set('selectedEvent', null);
    var thisValue = $('.radio-button input[type=radio]:checked').val();
    Session.set('eventTimeframe', thisValue);
  }
});
