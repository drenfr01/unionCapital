function getEvent(transaction){
  var id = transaction.eventId;
  var event = Events.findOne({ _id: id });
  return event;
}

Template.checkPoints.helpers({
  approvedEvents: function() {
    return Meteor.users.transactionsFor(Meteor.userId(), false);
  },
  pendingEvents: function() {
    return Meteor.users.transactionsFor(Meteor.userId(), true);
  },
  eventName: function(){
    return getEvent(this).name;
  },
  eventPoints: function(){
    return getEvent(this).points;
  },
  eventStart: function(){
    return getEvent(this).startDate;
  },
  eventEnd: function(){
    return getEvent(this).endDate;
  },
  totalPoints: function() {
    return Meteor.users.totalPointsFor(Meteor.userId());
  }
});
