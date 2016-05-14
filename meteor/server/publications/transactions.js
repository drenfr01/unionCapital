//A partner should get access to all transactions for
//their members only
Meteor.publish('transactions', function(selector) {
  //check(selector, {approved: Match.Optional(Boolean)});
  var partnerAdmin = Meteor.users.findOne({_id: this.userId});
  var selector = selector;
  if (Roles.userIsInRole(this.userId, 'admin')) {

    return Transactions.find(selector, {sort: {transactionDate: -1}});

  } else if (Roles.userIsInRole(this.userId, 'partnerAdmin')) {

    var org = Meteor.users.findOne({ _id: this.userId }).primaryPartnerOrg();
    selector = _.extend(selector, {partnerOrg: {$in: org}});
    return Transactions.find(selector, {sort: {transactionDate: -1}});

  } else {
    selector = _.extend(selector, {userId: this.userId});
    return Transactions.find(selector, {sort: {transactionDate: -1}});
  }
});
