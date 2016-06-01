/* global moment */
/* global Events */
/* global AppConfig */

// Define variables need to the reactive search
var searchText = new ReactiveVar();
var options = { sort: { eventDate: 1 }}

Template.checkIntoEvent.rendered = function() {
  Session.set('eventTimeframe', 'current');
  searchText.set($('#eventSearchBox').val().trim());
};

Template.checkIntoEvent.helpers({
  'getEvents': function() {
    var selector = {};

    if (Session.equals('eventTimeframe', 'current')) {
      selector.eventDate = {
        $gte: moment().add(AppConfig.checkIn.today.hoursBehind, 'h').toDate(),
        $lte: moment().add(AppConfig.checkIn.today.hoursAhead, 'h').toDate(),
      };
    } else {
      selector.eventDate = {
        $gte: moment().add(AppConfig.checkIn.past.hoursBehind, 'h').toDate(),
        $lte: moment().add(AppConfig.checkIn.past.hoursAhead, 'h').toDate(),
      };
    }

    return Events.eventsSearch(searchText.get(), selector, options);
  },
});

Template.checkIntoEvent.events({
  'keyup #eventSearchBox': _.throttle(function() {
    searchText.set($('#eventSearchBox').val().trim());
  }, 100),

  'click .check-in-button': function(e) {
    e.preventDefault();

    const id = this._id;
    if (id) {
      Router.go('eventCheckinDetails', {id: id} );
    }
  },

  'click #clearBtn': function() {
    // CheckinEventsSearch.search('');
    searchText.set('');
    $('#eventSearchBox').val('');
  },

  'click #pastOrCurrentRdoDiv': function() {
    // Session.set('selectedEvent', null);
    var thisValue = $('.radio-button input[type=radio]:checked').val();
    Session.set('eventTimeframe', thisValue);
  },
});
