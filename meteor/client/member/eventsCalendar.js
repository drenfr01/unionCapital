// var options = {
//   keepHistory: 1,
//   localSearch: false
// };

// var fields = ['name', 'description'];

// EventsSearch = new SearchSource('eventsSearch', fields, options);

// var getEventsData = function() {
//   return EventsSearch.getData({
//     transform: function(matchText, regExp) {
//       return matchText.replace(regExp, "<span style='color:red'>$&</span>");
//     },
//     sort: {eventDate: 1}
//   });
// };

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
    var attributes = {
      eventId : this._id,
      numberOfPeople: $('.in .numberOfPeople').val()
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

