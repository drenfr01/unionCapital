Meteor.publish('races', function() {
  return Races.find();
});
Meteor.publish('ethnicities', function() {
  return Ethnicities.find();
});
Meteor.publish('kids', function() {
  return Kids.find();
});

Meteor.publish('partnerOrganizations', function() {
  return PartnerOrgs.find();
});

Meteor.publish('incomeBrackets', function() {
  return IncomeBrackets.find();
});

Meteor.publish("eventOrgs", function() {
  return EventOrgs.find();
});

Meteor.publish("eventCategories", function() {
  return EventCategories.find();
});

Meteor.publish("events", function() {
  return Events.find();
});

Meteor.publish("reservations", function() {
  return Reservations.find();
});

Meteor.publish('transactions', function(userId) {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Transactions.find();
  } else {
    return Transactions.find({userId: userId});
  }
});

//TODO: limit this 
Meteor.publish('images', function() {
  return Images.find();
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
