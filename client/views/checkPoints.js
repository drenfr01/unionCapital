Template.checkPoints.helpers({
  'totalPoints': function() {
    return Meteor.user().profile.points;
  },
  'activities': function() {
    //TODO: currently pulling all transactions, need to limit it by userId. This involves setting a hidden field for userId on autoform?
    return Transactions.find();
  }
});
