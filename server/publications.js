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
  } else if(this.userId) {
    return Meteor.users.find({_id: this.userId}, 
                             {fields: {'services.facebook.first_name': 1,
                              'services.facebook.last_name': 1,
                              'services.facebook.email': 1}});
  } else {
    this.ready();
  }
});
