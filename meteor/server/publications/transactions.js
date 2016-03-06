//A partner should get access to all transactions for
//their members only
Meteor.publish('transactions', function(selector) {
  var partnerAdmin = Meteor.users.findOne({_id: this.userId});
  var selector = selector;
  if (Roles.userIsInRole(this.userId, 'admin')) {

    return Transactions.find(selector, {sort: {transactionDate: -1}});

  } else if (Roles.userIsInRole(this.userId, 'partnerAdmin')) {

    var org = Meteor.users.findOne({ _id: this.userId }).profile.partnerOrg;
    selector = _.extend(selector, {partnerOrg: org});
    return Transactions.find(selector, {sort: {transactionDate: -1}});

  } else {
    selector = _.extend(selector, {userId: this.userId});
    return Transactions.find(selector, {sort: {transactionDate: -1}});
  }
});
