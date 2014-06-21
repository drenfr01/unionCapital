AutoForm.addHooks('insertTransactionForm', {
  before: {
    insert: function(transaction) {
      transaction.userId = Meteor.userId();
      transaction.needsApproval = false; //false means it will show up on checkPoints
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
