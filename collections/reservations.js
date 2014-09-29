Reservations = new Meteor.Collection('reservations');
Reservations.attachSchema(new SimpleSchema({
  eventId: {
    type: String,
    label: 'Name of Event',
    optional: true
  },
  dateEntered: {
    type: Date,
    label: 'Date RSVP made',
    optional: true
  },
  numberOfPeople: {
    type: Number,
    label: 'Size of Party',
    defaultValue: 1,
    optional: true
  }
}));

Reservations.getReservationsForEvent = function(eventId) {
  return Reservations.find({eventId: eventId});
};

Reservations.getTotalPeopleForEvent = function(eventId) {
  var allReservations = Reservations.find({eventId: eventId}).fetch();
  return _.reduce(allReservations, function(sum, reservation) { 
    return sum + reservation.numberOfPeople; 
  }, 0);
};

Reservations.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
});
