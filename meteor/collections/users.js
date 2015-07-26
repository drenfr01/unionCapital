//approvedFlag is boolean which determines if the transaction is pending or already submitted
Meteor.users.transactionsFor = function(userId, approvedFlag) {
  return Transactions.find(
    { userId: userId, approved: approvedFlag , deleteInd: { $ne: true }},
    { sort: { transactionDate: -1 } });
};

// TODO: Change this to a collection helper
Meteor.users.totalPointsFor = function(userId) {
  var user = this.findOne(userId);

  if (user.profile.points === undefined || user.profile.points === null)
    Meteor.call('calcPoints', userId);

  return user.profile.points;
};

Meteor.users.deny({
  update: function() {
    return true;
  }
});
