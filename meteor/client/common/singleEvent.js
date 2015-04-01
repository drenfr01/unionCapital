Session.setDefault('rsvpList', null);

Template.singleEvent.helpers({
  'rsvpList': function() {
    return Reservations.find();
  }
});

Template.singleEvent.events({
  'click .back': function(e) {
    if(Roles.userIsInRole(Meteor.userId(), ['user'])) {
      Router.go('eventsCalendar');
    } else {
      Router.go('manageEvents');
    }
  }
});
