//A partner should get access to all transactions for
//their members only
Meteor.publish('transactions', function(selector, options) {
  //check(selector, {approved: Match.Optional(Boolean)});
  var partnerAdmin = Meteor.users.findOne({_id: this.userId});
  var selector = selector;
  var options = options || {};
  var options = _.extend(options, {sort: {transactionDate: -1}});

  if (Roles.userIsInRole(this.userId, 'admin')) {

  
    return Transactions.find(selector, options);

  } else if (Roles.userIsInRole(this.userId, 'partnerAdmin')) {

    var org = Meteor.users.findOne({ _id: this.userId }).primaryPartnerOrg();
    selector = _.extend(selector, {partnerOrg: org});
    return Transactions.find(selector, options);

  } else {
    selector = _.extend(selector, {userId: this.userId});
    return Transactions.find(selector, options);
  }
});
