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
      return Events.find({startDate: {'$lte': new Date()}, 
                         endDate: {'$gte': new Date()}, 
                         active: 1},
                         {sort: {startDate: 1}});
    } else if (Session.equals('eventType', 'Upcoming')) {
      return Events.find({startDate: {'$gt': new Date()}, active: 1},
                         {sort: {startDate: 1}});
    } else {
      return Events.find({endDate: {'$gte': new Date()}, active: 1},
                         {sort: {startDate: 1}});
    }
  },
  'title': function() {
    //this here is set by data context in iron-router (lib/router.js)
    return this + " Events";
  },
  'eventActionTitle': function() {
    if(Session.equals('eventType', 'Current')) {
      return "";
    } else {
      return "Will Attend";
    }
  },
  'eventAction': function() {
    if(Session.equals('eventType', 'Current')) {
      return "<button class='btn btn-small checkIn'>Check In</button>";
    } else {
      return "<input type='checkbox' value=''>";
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
  }
});

Template.listEvents.rendered = function() {
  Session.set('eventType', this.data);
  Session.set('eventIndex', true);
};
