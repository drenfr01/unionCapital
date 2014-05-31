Template.listEvents.helpers({
  'communityEvents': function() {
    return Events.find({active: 1}, {sort: {startDate: 1}});
  },
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
  'isAdmin': function() {
  		return false;
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
  }
});

Template.listEvents.rendered = function() {  
  Session.set('eventIndex', true);
};
