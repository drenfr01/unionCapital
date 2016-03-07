CalendarEventsSearch = new CalendarEvents();
var searchString = new ReactiveVar();

Template.eventsCalendar.rendered = function() {
  // CalendarEventsSearch.search("");
  searchString.set('');
};

Template.eventsCalendar.onCreated(function() {
  this.subscribe('reservations');
});

Template.eventsCalendar.helpers({

  hasPastEvents: function() {
    return !_.isEmpty(CalendarEventsSearch.getPastEvents(searchString.get()));
  },

  hasFutureEvents: function() {
    return !_.isEmpty(CalendarEventsSearch.getFutureEvents(searchString.get()));
  },

  hasNoEvents: function() {
    return _.isEmpty(CalendarEventsSearch.getPastEvents(searchString.get())) && _.isEmpty(CalendarEventsSearch.getFutureEvents(searchString.get()));
  }
});

Template.eventsCalendar.events({

  'keyup #search-box': _.throttle(function(e) {
    var text = $(e.target).val().trim();
    // CalendarEventsSearch.search(text);
    searchString.set(text);
  }, 200),

  'click .insertReservation': function(e) {
    e.preventDefault();

    thisId = this._id;
    var attributes = {
      eventId : thisId,
      numberOfPeople:  $('#select' + thisId).val()
    };

    Meteor.call('insertReservations', attributes, function(error) {
      if(error)
        addErrorMessage(error.reason);
    });
  },

  'click .removeReservation': function(e) {
    //make server side call to remove that reservation
    var eventId = this._id;

    Meteor.call('removeReservation', eventId, function(error) {
      if(error)
        addErrorMessage(error.reason);
    });
  },

  'click #back': function(e) {
    e.preventDefault();
    Router.go('manageEvents');
  },

  'click #clearBtn': function() {
    searchString.set('');
    // CalendarEventsSearch.search('');
    $('#search-box').val('');
    $('#search-box').focus();
  },

  // This is a hack. I have invested too much time to start over, sorry.
  // Bootstrap enforces strict structure on their accordions that, when broken, cause strangeness
  // with collapsing other accordions during the opening of a new one
  // This just makes sure to collapse all other accordions when a new one is opened
  'click .panel-heading': function(e) {
    thisId = $(e.target).attr('aria-controls');
    if ( !($(e.target).attr('id') === thisId) )
      $('.panel-collapse.in').not(" [id='" + thisId + "'] ").collapse("hide");
  }
});

// eventPanel
Template.eventPanel.helpers({
  getEvents: function() {
    if (this.type === 'past')
      return CalendarEventsSearch.getPastEvents(searchString.get());
    else if (this.type === 'future')
      return CalendarEventsSearch.getFutureEvents(searchString.get());
  },

  hasReservation: function() {
    return Reservations.findOne({
      userId: Meteor.userId(),
      eventId: this._id
    });
  },

  people: function() {
    return NumberOfPeople.find();
  },

  hasMembers: function() {
    return !_.isEmpty(this);
  },

  isFuture: function(thisType) {
    return thisType.type === 'future';
  }
});

Template.eventsCalendar.events({
  'click .calCheckIn': function() {
    Router.go('eventCheckinDetails', {id: this._id});
  }
});
