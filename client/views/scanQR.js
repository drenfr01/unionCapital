AutoForm.addHooks('insertTransactionForm', {
  before: {
    insert: function(transaction) {
      transaction.userId = Meteor.userId();
      return transaction;
    }
  },
  onSuccess: function(){
    throwError('Points Added!', 'alert-success');
    Router.go('memberHomePage');
  }
});
