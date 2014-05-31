Transactions = new Meteor.Collection('transactions', {
  schema: {
    transactionDate: {
              type: Date,
              label: 'Date of Transaction'
             },
     userId: {
               type: String,
               label: 'User Identifier',
               optional: true
             },
     activity: {
               type: String,
               label: 'Event Name'
               }
          }
});

Transactions.allow({
  insert: function() {
            return true;
          },
  update: function() {
            return true;
          },
  remove: function() {
            return true;
          },
});
