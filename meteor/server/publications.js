Meteor.publish('partnerOrgSectors', function() {
  return PartnerOrgSectors.find();
});

Meteor.publish('races', function() {
  return Races.find();
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

Meteor.publish("eventOrgs", function() {
  return EventOrgs.find();
});

Meteor.publish("eventCategories", function() {
  return EventCategories.find();
});

Meteor.publish("ucbappaccess", function() {
  return UCBAppAccess.find();
});


// ------------- EVENT PUBLICATIONS --------------
Meteor.publish("events", function(start, end) {
  var selector = {};
  if (typeof start === 'date' && typeof end === 'date')
    selector.eventDate = { $gte: start, $lte: end };

  return Events.find(selector);
});

Meteor.publish("singleEvent", function(id) {
  if (!id)
    throw new Error('Bad event id in subscription');

  return Events.find({ _id: id });
});

Meteor.publish("eventsForUser", function(userId) {
  var self = this;

  check(userId, String);

  if (!Roles.userIsInRole(self.userId, ['admin', 'partnerAdmin']))
    userId = self.userId;

  var eventIds = Transactions.find({ userId: userId }, { fields: { eventId: 1 } }).fetch();
  return Events.find({ _id: { $in: eventIds } });
});

Meteor.publish("eventsForTransactions", function() {
  var self = this;

  var selector = { approved: false, deleteInd: false };

  if (Roles.userIsInRole(self.userId, 'partnerAdmin')) {
    // Uses the partner admin's org to filter if not superadmin
    selector.approvalType = 'partner_admin';
    selector.partnerOrg = Meteor.users.findOne(self.userId).profile.partnerOrg;
  }

  var eventIds = _.chain(Transactions.find(selector, { fields: { eventId: 1 } }).fetch())
                  .pluck('eventId')
                  .uniq()
                  .value();

  // Add the special button event
  eventIds.push(Events.findOne({ name: AppConfig.ucbButtonEvent })._id);

  return Events.find({ _id: { $in: eventIds } });
});

//The idea here is to publish all reservations
//that a partner admin has access to
//This is any member that belongs to that partner
//OR any member attending an event hosted by
//that partner.
Meteor.publish("reservations", function() {
  if(Roles.userIsInRole(this.userId, 'admin')) {
    return Reservations.find();
  } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {
    var partnerAdminScope = ServerHelpers.partnerAdminScope(this.userId);
    return Reservations.find({$or: [
     {userId: {$in: partnerAdminScope.usersArray}},
     {eventId: {$in: partnerAdminScope.eventsArray}}
    ]});
  } else {
    return Reservations.find({userId: this.userId});
  }
});

//A partner should get access to all transactions for
//their members only
Meteor.publish('transactions', function() {
  var partnerAdmin = Meteor.users.findOne({_id: this.userId});
  if (Roles.userIsInRole(this.userId, 'admin')) {

    return Transactions.find();

  } else if (Roles.userIsInRole(this.userId, 'partnerAdmin')) {

    var org = Meteor.users.findOne({ _id: this.userId }).profile.partnerOrg;
    return Transactions.find({ partnerOrg: org });

  } else {

    return Transactions.find({userId: this.userId});

  }
});

//Partner Admins can only see images from their users
Meteor.publish('images', function() {
  var user = Meteor.users.findOne({_id: this.userId});

  if (Roles.userIsInRole(this.userId, 'admin')) {

    return Images.find();

  } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {

    var users = Meteor.users.find({ 'profile.partnerOrg': user.profile.partnerOrg }).fetch();
    return Images.find({ 'metadata.userId': { $in: users }});

  } else if(this.userId) {

    return Images.find({ 'metadata.userId': this.userId });

  } else {
    this.ready();
  }
});

Meteor.publish('userData', function() {
  var user = Meteor.users.findOne({_id: this.userId});
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find();
  } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {
    return Meteor.users.find({"profile.partnerOrg": user.profile.partnerOrg, roles: { $all: ['user'] }, deleteInd: false});
  } else if(this.userId) {
    return Meteor.users.find({_id: this.userId, deleteInd: false},
                             {fields: {'services.facebook.first_name': 1,
                              'services.facebook.last_name': 1,
                              'services.facebook.email': 1}});
  } else {
    this.ready();
  }
});
