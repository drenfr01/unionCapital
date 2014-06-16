removeTransaction = function(transactionId) {
  check(transactionId, String);
  Transactions.update(transactionId, {$set: {needsApproval: false}});
};
