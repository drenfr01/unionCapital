Meteor.users.transactionsFor = function(userId) {
  return Transactions.find(
    { userId: userId, needsApproval: {$exists: false} },
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
