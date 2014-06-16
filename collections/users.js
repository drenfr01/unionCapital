//needsApprovalFlag is boolean which determines if the transaction is pending or already submitted
Meteor.users.transactionsFor = function(userId, needsApprovalFlag) {
  return Transactions.find(
    { userId: userId, needsApproval: needsApprovalFlag },
    { sort: { transactionDate: -1 } });
};



Meteor.users.totalPointsFor = function(userId) {
  return Transactions
    .find({userId: userId,needsApproval: {$exists: false} })
    .fetch()
    .reduce(function(sum, transaction) {
      var event = Transactions.eventFor(transaction);
      return sum += event.points;
    }, 0);
};
