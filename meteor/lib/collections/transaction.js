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
    event: {
      type: Object,
      label: 'Event Name',
      blackbox: true,
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
      label: 'Approval Date',
      optional: true
    },
    partnerOrg: {
      type: String,
      label: 'Partner Organization',
      optional: true
    },
    category: {
      type: String,
      label: 'Category',
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
    },
    addons: {
      type: [Object],
      label: 'Point modifiers',
      blackbox: true,
      optional: true
    },
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

//Collection hook to update image document with affiliated transaction ID
//used to improve experience for approve points template for super admins
Transactions.after.insert(function(userId, doc){
  Images.update(doc.imageId, {$set: {'metadata.transactionId': doc._id}});
});
