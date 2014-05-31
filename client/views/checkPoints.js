Template.checkPoints.helpers({
  'totalPoints': function() {
    return Transactions.find({userId: Meteor.userId()}).fetch().reduce(function(sum, transaction) {
      return sum += transaction.points;
    }, 0);
  },
  'activities': function() {
    //TODO: currently pulling all transactions, need to limit it by userId. This involves setting a hidden field for userId on autoform?
    return Transactions.find();
  }
});
