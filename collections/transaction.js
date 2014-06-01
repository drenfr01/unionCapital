Transactions = new Meteor.Collection('transactions', {
  schema: {
     userId: {
               type: String,
               label: 'User Identifier',
               optional: true
             },
     eventID: {
               type: String,
               label: 'ID of related Event',
               optional: true
               },
     imageId: {
                type: String,
                label: 'Image Id',
                optional: true
              },
     needsApproval: {
                      type: Boolean,
                      label: 'Needs Approval?',
                      optional: true
                    },
     pendingEventName: {
                        type: String,
                        label: 'Event Name',
                        optional: true
          },
     pendingEventDescription: {
                                type: String,
                                label: 'Event Description',
                                optional: true
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
