Meteor.publish("events", function() {
  return Events.find();
});

Meteor.publish('transactions', function() {
  return Transactions.find();
});

Meteor.publish('images', function() {
  return Images.find();
});

Meteor.publish('userData', function() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    console.log(Meteor.users.find().fetch());
    return Meteor.users.find();
  } else {
    this.ready();
  }

});
