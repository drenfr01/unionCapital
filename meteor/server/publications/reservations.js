//The idea here is to publish all reservations
//that a partner admin has access to
//This is any member that belongs to that partner
//OR any member attending an event hosted by
//that partner.
Meteor.publish("reservations", function() {
  if(Roles.userIsInRole(this.userId, 'admin')) {
    return Reservations.find();
  } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {
    var partnerAdminScope = ServerHelpers.partnerAdminScope(this.userId);
    return Reservations.find({$or: [
     {userId: {$in: partnerAdminScope.usersArray}},
     {eventId: {$in: partnerAdminScope.eventsArray}}
    ]});
  } else {
    return Reservations.find({userId: this.userId});
  }
});
