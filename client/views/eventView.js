Template.listEvents.events({
	'click .back': function(e) {
		Session.set('eventIndex', true);
	 	Session.set('event', null);
	}
});