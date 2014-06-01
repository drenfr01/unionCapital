AutoForm.addHooks('insertTransactionForm', {
  before: {
    insert: function(transaction) {
      transaction.userId = Meteor.userId();
      return transaction;
    }
  },
  onSuccess: function(){
    addSuccessMessage('Points Added!');
    Router.go('checkPoints');
  },
  onError: function(operation, error, template) {
    addErrorMessage(error.message);
  },
});
