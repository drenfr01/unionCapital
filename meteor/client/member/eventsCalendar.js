CalendarEventsSearch = new CalendarEvents();

Template.eventsCalendar.rendered = function() {
  CalendarEventsSearch.search("");
};

Template.eventsCalendar.helpers({

  getFutureEvents: function() {
    return CalendarEventsSearch.getFutureEvents();
  },

  getPastEvents: function() {
    return CalendarEventsSearch.getPastEvents();
  },

  hasPastEvents: function() {
    return !_.isEmpty(CalendarEventsSearch.getPastEvents());
  },

  hasFutureEvents: function() {
    return !_.isEmpty(CalendarEventsSearch.getFutureEvents());
  },

  hasNoEvents: function() {
    return _.isEmpty(CalendarEventsSearch.getPastEvents()) && _.isEmpty(CalendarEventsSearch.getFutureEvents());
  }
});

Template.eventsCalendar.events({

  'keyup #search-box': _.throttle(function(e) {
    var text = $(e.target).val().trim();
    CalendarEventsSearch.search(text);
  }, 200),

  'click .insertReservation': function(e) {
    e.preventDefault();

    thisId = this._id;
    var attributes = {
      eventId : thisId,
      numberOfPeople:  $('#select' + thisId).val()
    };

    Meteor.call('insertReservations', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Congratulations, you've successfully RSVPed!");
      }
    });
  },

  'click .removeReservation': function(e) {
    //make server side call to remove that reservation
    var eventId = this._id;

    Meteor.call('removeReservation', eventId, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Your reservation has been removed");
      }
    });
  },

  'click #back': function(e) {
    e.preventDefault();
    Router.go('manageEvents');
  },

  'click #clearBtn': function() {
    CalendarEventsSearch.search('');
    $('#search-box').val('');
    $('#search-box').focus();
  },

  'click .panel': function(e) {
    thisId = $(e.target).attr('aria-controls');
    if ( !($(e.target).attr('id') === thisId) )
      $('.panel-collapse.in').not(" [id='" + thisId + "'] ").collapse("hide");
  }
});

// eventPanel
Template.eventPanel.helpers({

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
  }
});

