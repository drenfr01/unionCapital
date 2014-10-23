//needsApprovalFlag is boolean which determines if the transaction is pending or already submitted
Meteor.users.transactionsFor = function(userId, needsApprovalFlag) {
  //TODO: the check for pendingEventName is a complete hack. we need to have a way to logically separate 
  //ad-hoc events from schedule ones, or better yet convert pending events to regular ones once they've been approved
  return Transactions.find(
    { userId: userId, needsApproval: needsApprovalFlag , deleteInd: { $ne: true }},
    { sort: { transactionDate: 1 } });
};



Meteor.users.totalPointsFor = function(userId) {
  return Transactions
  .find({userId: userId, needsApproval: false, eventId: {$exists: true} })
  .fetch()
  .reduce(function(sum, transaction) {
    var event = Transactions.eventFor(transaction);
    if(event.isPointsPerHour) {
      return Math.round(sum += event.pointsPerHour * totalHours(transaction.hoursSpent, transaction.minutesSpent));
    } else {
      return sum += event.points;
    }
  }, 0);
};

