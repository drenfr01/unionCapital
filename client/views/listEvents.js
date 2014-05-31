Template.listEvents.rendered = function() {
  //Session.set('modalDataContext', n);
};

Template.listEvents.helpers({
  'communityEvents': function() {
    return Events.find({active: 1}, {sort: {startDate: 1}});
  },
  'modalContext': function() {
    return Session.get('modalDataContext');
  }
});

Template.listEvents.events({
  'click #editEvent': function(e) {
    console.log(this);
    Session.set('modalDataContext', this);
  }
});
