Transactions = new Meteor.Collection('transactions', {
  schema: {
    userId: {
      type: String,
      label: 'User Identifier',
      optional: true
    },
    eventId: {
      type: String,
      label: 'ID of related Event',
      optional: true
    },
    imageId: {
      type: String,
      label: 'Image Id',
      optional: true
    },
    //Manually set this to false for QR code submissions
    needsApproval: {
      type: Boolean,
      label: 'Needs Approval'
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
    },
    transactionDate: {
      type: String,
      label: 'Transaction Date',
      optional: true
    },
    hoursSpent: {
      type: Number,
      label: 'Number of Hour Spent',
      optional: true
    },
    minutesSpent: {
      type: Number,
      label: 'Number of Minutes Spent',
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

Transactions.eventFor = function(transaction) {
  return Events.findOne({ _id: transaction.eventId });
};
