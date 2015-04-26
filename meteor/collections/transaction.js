Transactions = new Meteor.Collection('transactions');

Transactions.attachSchema(new SimpleSchema({
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
    approvalType: {
      type: String,
      label: 'Needs Approval'
    },
    approved: {
      type: Boolean,
      label: 'Approved'
    },
    partnerOrg: {
      type: String,
      label: 'Partner Organization',
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
    },
    transactionDate: {
      type: Date,
      label: 'Transaction Date',
      optional: true
    },
    hoursSpent: {
      type: Number,
      label: 'Number of Hour Spent',
      optional: true
    },
    userLng: {
      type: Number,
      label: 'User Longitude',
      optional: true,
      decimal: true
    },
    userLat: {
      type: Number,
      label: 'User Latitude',
      optional: true,
      decimal: true
    },
    //TODO: remove optional flag once all transactions update
    deleteInd: {
      type: Boolean,
      label: 'Logical Deletion',
      optional: true
    }
}));

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
