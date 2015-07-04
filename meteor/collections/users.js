//approvedFlag is boolean which determines if the transaction is pending or already submitted
Meteor.users.transactionsFor = function(userId, approvedFlag) {
  return Transactions.find(
    { userId: userId, approved: approvedFlag , deleteInd: { $ne: true }},
    { sort: { transactionDate: -1 } });
};

Meteor.users.totalPointsFor = function(userId) {
  return Transactions
  .find({userId: userId, approved: true, eventId: {$exists: true} })
  .fetch()
  .reduce(function(sum, transaction) {
    var event = Transactions.eventFor(transaction);
    if(event && event.isPointsPerHour) {
      return Math.round(sum += event.pointsPerHour * transaction.hoursSpent);
    } else if(event) {
      return sum += event.points;
    }
  }, 0);
};

Meteor.users.deny({
  update: function() {
    return true;
  }
});

AllMembers = new Mongo.Collection('allMembers');
