
Template.listEvents.helpers({
  'communityEvents': function() {
  		return Events.find({active: 1}, {sort: {startDate: 1}});
  },
  'isEventIndex': function() {
  		return Session.get('eventIndex');
  },
  'eventView': function() {
  		return Session.get('event');
	}
});

Template.listEvents.events({
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