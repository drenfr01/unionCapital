//approvedFlag is boolean which determines if the transaction is pending or already submitted
Meteor.users.transactionsFor = function(userId, approvedFlag) {
  return Transactions.find(
    { userId: userId, approved: approvedFlag , deleteInd: { $ne: true }},
    { sort: { transactionDate: -1 } });
};

Meteor.users.totalPointsFor = function(userId) {
  //find all transactions for user
  //get event to find points
  //calculate sum
  var sum = 0;
  var approvedTransactions = Transactions.find({userId: userId, approved: true, eventId: {$exists: true} });
  approvedTransactions.forEach(function(transaction) {
    var event = Transactions.eventFor(transaction);
    if(event && event.isPointsPerHour) {
      sum = Math.round(sum + (event.pointsPerHour * transaction.hoursSpent));
    } else if(event) {
      sum += event.points;
    }
  });
  return sum;
};

Meteor.users.deny({
  update: function() {
    return true;
  }
});
