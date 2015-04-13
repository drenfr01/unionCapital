Meteor.publish('partnerOrgSectors', function() {
  return PartnerOrgSectors.find();
});

Meteor.publish('races', function() {
  return Races.find();
});
Meteor.publish('ethnicities', function() {
  return Ethnicities.find();
});
Meteor.publish('kids', function() {
  return Kids.find();
});

Meteor.publish('numberOfPeople', function() {
  return NumberOfPeople.find();
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

//The idea here is to publish all reservations
//that a partner admin has access to
//This is any member that belongs to that partner
//OR any member attending an event hosted by 
//that partner.
Meteor.publish("reservations", function() {
  var partnerAdmin = Meteor.users.findOne({_id: this.userId});
  if(Roles.userIsInRole(this.userId, 'admin')) {
    return Reservations.find();
  } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {
    //TODO: This will perform horribly at scale. Please refactor....
    var users = Meteor.users.find({"profile.partnerOrg": partnerAdmin.profile.partnerOrg}, {fields: {_id: 1}}).fetch();
    var usersArray = _.map(users, function(user) {
      return user._id;
    });
    var events = Events.find({institution: partnerAdmin.profile.partnerOrg}, {fields: {_id: 1}}).fetch();
    var eventsArray = _.map(events, function(event) {
      return event._id;
    });

    return Reservations.find({$or: [
     {userId: {$in: usersArray}},
     {eventId: {$in: eventsArray}}
    ]});
  } else {
    return Reservations.find({userId: this.userId});
  }
});

//A partner should get access to all transactions for 
//their members only
Meteor.publish('transactions', function(userId) {
  var partnerAdmin = Meteor.users.findOne({_id: this.userId});
  if (Roles.userIsInRole(this.userId, 'admin')) {

    return Transactions.find();

  } else if (Roles.userIsInRole(this.userId, 'partnerAdmin')) {

    var org = Meteor.users.findOne({ _id: this.userId }).profile.partnerOrg;
    return Transactions.find({ partnerOrg: org });

  } else {

    return Transactions.find({userId: userId});

  }
});

//TODO: limit this
Meteor.publish('images', function() {
  return Images.find();
});

Meteor.publish('userData', function() {
  var user = Meteor.users.findOne({_id: this.userId});
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find();
  } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {
    return Meteor.users.find({"profile.partnerOrg": user.profile.partnerOrg});
  } else if(this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'services.facebook.first_name': 1,
                              'services.facebook.last_name': 1,
                              'services.facebook.email': 1}});
  } else {
    this.ready();
  }
});
