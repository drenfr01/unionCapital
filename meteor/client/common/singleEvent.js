Session.setDefault('rsvpList', null);

Template.singleEvent.helpers({
  'rsvpList': function() {
    var reservations = Reservations.getReservationsForEvent(this._id).fetch();
    //WARNING: this may not scale well, running repeated calls against db
    //I don't know if Meteor is smart enough to cache mongo cursor
    return _.map(reservations, function(reservation) {
      var user = Meteor.users.findOne({_id: reservation.userId});
      return {firstName: user.profile.firstName, 
        lastName: user.profile.lastName.substring(0,1), 
        numberOfPeople: reservation.numberOfPeople};
    });
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
