Transactions = new Meteor.Collection('transactions');

Transactions.attachSchema(new SimpleSchema({
    userId: {
      type: String,
      label: 'User Identifier',
      optional: true
    },
    firstName: {
      type: String,
      label: 'Member first name',
      optional: true,
    },
    lastName: {
      type: String,
      label: 'Member last name',
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
    approvalDate: {
      type: Date,
      label: 'Date transaction was approved by admin'
    },
    partnerOrg: {
      type: String,
      label: 'Partner Organization',
      optional: true
    },
    eventName: {
      type: String,
      label: 'Event Name',
      optional: true
    },
    eventDescription: {
      type: String,
      label: 'Description',
      optional: true
    },
    category: {
      type: String,
      label: 'Category',
      optional: true
    },
    eventDate: {
      type: Date,
      label: 'Event Date',
      optional: true
    },
    eventAddress: {
      type: String,
      label: 'Event Address',
      optional: true
    },
    transactionDate: {
      type: Date,
      label: 'Transaction Date',
      optional: true
    },
    hoursSpent: {
      type: Number,
      label: 'Number of Hours Spent',
      optional: true,
      decimal: true
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
    points: {
      type: Number,
      label: 'Points for this transaction'
    },
    //TODO: remove optional flag once all transactions update
    deleteInd: {
      type: Boolean,
      label: 'Logical Deletion',
      optional: true
    },
    hasUCBButton: {
      type: Boolean,
      label: "Flag if member wore a button",
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
