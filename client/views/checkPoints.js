Template.checkPoints.helpers({
  'totalPoints': function() {
    return Transactions.find({userId: Meteor.userId()}).fetch().reduce(function(sum, transaction) {
      return sum += transaction.points;
    }, 0);
  },
  'activities': function() {
    return Transactions.find(
      { userId: Meteor.userId() },
      { sort: { transactionDate: -1 } });
  }
});
