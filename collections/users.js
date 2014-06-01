Meteor.users.transactionsFor = function(userId) {
  return Transactions.find(
    { userId: userId },
    { sort: { transactionDate: -1 } });
};

Meteor.users.totalPointsFor = function(userId) {
  return Transactions
    .find({userId: userId})
    .fetch()
    .reduce(function(sum, transaction) {
      var event = Transactions.eventFor(transaction);
      return sum += event.points;
    }, 0);
};
