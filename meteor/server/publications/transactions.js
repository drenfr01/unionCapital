/* global Transactions */
/* global Roles */

//A partner should get access to all transactions for
//their members only
Meteor.publish('transactions', function(selector, options) {
  const { userId } = this;

  const extendedSelector = {
    deleteInd: false,
    ...selector,
  };

  const extendedOptions = {
    sort: {
      transactionDate: -1,
    },
    ...options,
  };

  if (Roles.userIsInRole(userId, 'admin')) {
    return Transactions.find(extendedSelector, extendedOptions);
  } else if (Roles.userIsInRole(userId, 'partnerAdmin')) {
    const partnerOrg = Meteor.users.findOne({ _id: userId }).primaryPartnerOrg();
    return Transactions.find({ ...extendedSelector, partnerOrg }, extendedOptions);
  }
  return Transactions.find({ ...extendedSelector, userId }, extendedOptions);
});
