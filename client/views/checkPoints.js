function getEvent(transaction){
  var id = transaction.eventID;
  var event = Events.findOne({ _id: id });
  return event;
}

Template.checkPoints.helpers({
  'totalPoints': function() {
    return Transactions
      .find({userId: Meteor.userId()})
      .fetch()
      .reduce(function(sum, transaction) {
        var event = getEvent(transaction);
        return sum += event.points;
      }, 0);
  },
  'getEvent': function(){
    return getEvent(this).name;
  },
  'getPoints': function(){
    return getEvent(this).points;
  },
  'getEventStart': function(){
    return getEvent(this).startDate;
  },
  'getEventEnd': function(){
    return getEvent(this).endDate;
  },
  'activities': function() {
    return Transactions.find(
      { userId: Meteor.userId() },
      { sort: { transactionDate: -1 } });
  }
});
