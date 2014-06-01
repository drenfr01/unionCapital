Transactions = new Meteor.Collection('transactions', {
  schema: {
     userId: {
               type: String,
               label: 'User Identifier',
               optional: true
             },
     eventID: {
               type: String,
               label: 'ID of related Event'
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

Transactions.eventFor = function(transaction) {
  return Events.findOne({ _id: transaction.eventID });
};
