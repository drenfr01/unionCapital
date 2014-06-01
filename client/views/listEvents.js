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
  //Return event in session to be accessed by eventView template
  'currentEvent': function() {
      return Session.get('event');
  },
});

Template.listEvents.events({
  'click .editEvent': function(e) {
   	Session.set('modalDataContext', this);
  },
  'click #submit': function(e) {
  		$('#editModal').modal('hide');
  }, 
  //Set event in session to be accessed by event view
  'click .to-view': function(e) {
		Session.set('eventIndex', false);
		Session.set('event', this);
	},
});

Template.listEvents.rendered = function() {  
  Session.set('eventIndex', true);
};
