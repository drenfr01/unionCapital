Session.setDefault('rsvpList', null);

Template.singleEvent.onCreated(function() {
  this.subscribe('reservations');
});

Template.singleEvent.helpers({
  'rsvpList': function() {
    return Reservations.find({eventId: this._id});
  },
  isPointsPerHour: function() {
    return this.isPointsPerHour;
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
