Template.listEvents.rendered = function() {
};

Template.listEvents.helpers({
  'communityEvents': function() {
    return Events.find({active: 1}, {sort: {startDate: 1}});
  },
  'modalContext': function() {
    return Session.get('modalDataContext');
  },
  'editingDoc': function() {
    return Events.findOne(Session.get('modalDataContext')._id);
  }
});

Template.listEvents.events({
  'click .editEvent': function(e) {
    Session.set('modalDataContext', this);
  }
});
