Meteor.publish("events", function() {
  return Events.find();
});

Meteor.publish('transactions', function() {
  return Transactions.find();
});

Meteor.publish('images', function() {
  return Images.find();
});

Meteor.publish('rewards', function() {
  return Rewards.find();
});

Meteor.publish('userData', function() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find();
  } else {
    this.ready();
  }
});
