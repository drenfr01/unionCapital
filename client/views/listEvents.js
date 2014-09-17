Template.listEvents.rendered = function() {
  Session.set('eventType', this.data);
  Session.set('eventIndex', true);
  Session.set('eventsOffset', 0);
};

Template.listEvents.helpers({
  'modalContext': function() {
    return Session.get('modalDataContext');
  },
  'editingDoc': function() {
    return Events.findOne(Session.get('modalDataContext')._id);
  },
  'isEventIndex': function() {
      return Session.get('eventIndex');
  },
  'eventView': function() {
      return Session.get('event');
  },
  'eventsToDisplay': function(){
    if(Session.equals('eventType', 'Current')) {
      console.log("Event offset: " + Session.get('eventsOffset'));
      return Events.currentEvents(Session.get('eventsOffset'));
    } else if (Session.equals('eventType', 'Upcoming')) {
      return Events.upcomingEvents();
    } else {
      return Events.allEvents();
    }
  },
  'title': function() {
    //this here is set by data context in iron-router (lib/router.js)
    return this + " Events";
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
  }
});

Template.listEvents.events({
  'click .editEvent': function(e) {
    Session.set('modalDataContext', this);
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
  }
});
