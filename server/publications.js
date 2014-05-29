Meteor.publish("events", function() {
  return Events.find();
});

Meteor.publish('transactions', function() {
  return Transactions.find();
});

Meteor.publish('images', function() {
  return Images.find();
});

Meteor.publish('adminMemberData', function() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find({});
  } else if (this.userId) {
    return Meteor.users.find({_id: this.userId});
  } else {
    this.ready();
  }

});
