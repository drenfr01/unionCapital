AutoForm.hooks({
  insertReservationsForm: {
    before: {
      insert: function(doc, template) {
        var rsvpEvent = Session.get('reservationModalDataContext');
        doc.eventId = rsvpEvent._id;
        doc.dateEntered = new Date();
        return doc;
      } 
    }
  }
});
Template.listEvents.rendered = function() {
  Session.set('eventType', this.data);
  Session.set('eventIndex', true);
  //TODO: remove magic number 7 below and make variable
  Session.set('eventsOffset', 7);
  Session.set('searchQuery', null);
};

Template.listEvents.helpers({
  'eventModalContext': function() {
    return Session.get('eventModalDataContext');
  },
  'reservationModalContext': function() {
    return Session.get('reservationModalDataContext');
  },
  'editingDoc': function() {
    return Events.findOne(Session.get('eventModalDataContext')._id);
  },
  'isEventIndex': function() {
      return Session.get('eventIndex');
  },
  'eventView': function() {
      return Session.get('event');
  },
  'eventsToDisplay': function(){
    if(Session.equals('eventType', 'Current')) {
      var startEndDates = Events.calculateStartEndDates(Session.get('eventsOffset'));
      return Events.currentEvents(startEndDates[0], startEndDates[1]);
    } else if (Session.equals('eventType', 'Upcoming')) {
      return Events.upcomingEvents();
    } else if (Session.equals('eventType', 'Searching')) {
      var keyword = Session.get("searchQuery");
      // TODO: Unit test this....
      if(!_.isUndefined(keyword) && !(keyword === "")){
        var query = new RegExp( keyword, 'i' );
        var currentDate = new Date();
        return Events.find({name: query, 
                           active: 1, 
                           endDate: {'$gte': currentDate}}, 
                           {limit: 5});
      }
      return false;
    } else {
      return Events.allEvents();
    }
  },
  'title': function() {
    //this here is set by data context in iron-router (lib/router.js)
    if(Session.equals('eventType', 'Current')) {
      var startEndDates = Events.calculateStartEndDates(Session.get('eventsOffset'));
      var startDate = moment(startEndDates[0]).format('MMMM DD YYYY');
      var endDate = moment(startEndDates[1]).format('MMMM DD YYYY');
      return startDate + " - " + endDate;
    } else if (Session.equals('eventType', 'Searching')) {
      return "Search Results";
    } else {
      return this + " Events";
    }
  },
  'pointType': function() {
    if(this.isPointsPerHour) {
      return "Points Per Hour";
    } else {
      return "Points";
    }
  },
  'pointsToDisplay': function() {
    if(this.isPointsPerHour) {
      return this.pointsPerHour;
    } else {
      return this.points;
    }
  },
  'displayNextLastWeekButtons': function() {
    if (Session.equals("eventType", "Current")) {
      return true;
    } else {
      return false;
    }
  }
});

Template.listEvents.events({
  'click .editEvent': function(e) {
    Session.set('eventModalDataContext', this);
  },
  'click .insertReservations': function(e) {
    Session.set('reservationModalDataContext', this);
    $(e.target).removeClass('insertReservations');
    $(e.target).removeClass('btn-default');
    $(e.target).addClass('btn-success');
    $(e.target).text('Remove RSVP');
  },
  'click .eventView': function(e) {
    Session.set('eventIndex', false);
    Session.set('event', this);
  },
  'click .back': function(e) {
    Session.set('eventIndex', true);
    Session.set('event', null);
  },
  'click .checkIn': function(e) {
    e.preventDefault();
    Router.go('checkIntoEvent', {eventId: this._id});
  },
  'click .deleteEvent': function(e) {
    e.preventDefault();

    Meteor.call('deleteEvent', this._id, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Event successfully deleted");
      }
    });
  },
  'click #prevEvents': function(e) {
    e.preventDefault();

    Session.set('eventsOffset', Session.get('eventsOffset') - 7);
  },
  'click #nextEvents': function(e) {
    e.preventDefault();

    Session.set('eventsOffset', Session.get('eventsOffset') + 7);
  },
  'keyup #eventSearch': function(e) {
    Session.set("searchQuery", e.currentTarget.value);
    if(Session.equals("searchQuery","")) { 
      Session.set("eventType", "Current");
    } else {
      Session.set("eventType", "Searching");
    }
  },
  'click #clearSearch': function(e) {
    e.preventDefault();

    $("#eventSearch").val("");
    Session.set("eventType","Current");
    Session.set("searchQuery", null);
  }
});
