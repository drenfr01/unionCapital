Session.setDefault('rsvpList', null);

Template.singleEvent.helpers({
  'rsvpList': function() {
    var reservations = Reservations.find().fetch();
    console.log(reservations);
    return _.map(reservations, function(reservation) {
      var user = Meteor.users.findOne({_id: reservation.userId});
      console.log(user);
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
