CalendarEventsSearch = new CalendarEvents();
var searchString = new ReactiveVar();
//contains a list of event Ids, used to 
//avoid re-creating add to calendar links
Session.set('calendarEventsCreated', []);

Template.eventsCalendar.onRendered(function() {
  // CalendarEventsSearch.search("");
  searchString.set('');
});

Template.eventsCalendar.onCreated(function() {
  this.subscribe('reservations');
  this.subscribe('numberOfPeople');
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
  },

});

Template.eventsCalendar.events({
  'click .calCheckIn': function() {
    Router.go('eventCheckinDetails', {id: this._id});
  },

  'click .panel-heading': function() {
    let eventsInSession = Session.get('calendarEventsCreated');

    if(!R.contains(this._id, eventsInSession)) {
      var myCalendar = createCalendar({
        options: {
          class: 'add-calendar-link',

          // You can pass an ID. If you don't, one will be generated for you
          id: 'addCal'+this._id
        },
        data: {
          // Event title
          title: this.name,

          // Event start date
          start: this.eventDate,

          // Event duration (IN MINUTES)
          duration: this.duration * 60, //duration is in hours on event doc

          // You can also choose to set an end time
          // If an end time is set, this will take precedence over duration
          //end: new Date('June 15, 2013 23:00'),     

          // Event Address
          address: this.address,

          // Event Description
          description: this.description
        }
      });

      document.querySelector("#calendar" + this._id).appendChild(
        myCalendar);

        Session.set('calendarEventsCreated', R.append(this._id,eventsInSession));
    }
  },
});
