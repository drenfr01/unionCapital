function getEvent(transaction){
  var id = transaction.eventID;
  var event = Events.findOne({ _id: id });
  return event;
}

Template.checkPoints.helpers({
  activities: function() {
    return Transactions.find(
      { userId: Meteor.userId() },
      { sort: { transactionDate: -1 } });
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
    return Transactions
      .find({userId: Meteor.userId()})
      .fetch()
      .reduce(function(sum, transaction) {
        var event = getEvent(transaction);
        return sum += event.points;
      }, 0);
  }
});
