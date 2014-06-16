function getEvent(transaction){
  var id = transaction.eventID;
  var event = Events.findOne({ _id: id });
  return event;
}

Template.checkPoints.helpers({
  activities: function() {
    return Meteor.users.transactionsFor(Meteor.userId(), false);
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
