Meteor.publish("events", function(start, end) {
  var selector = {};
  selector.deleteInd = false;
  selector.adHoc = false;
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

  check(userId, Match.Optional(String));

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

Meteor.publish('manageEvents', function() {
  var self = this;
  var selector = {};

  if (Roles.userIsInRole(self.userId, 'partnerAdmin'))
    selector.institution = Meteor.users.findOne(self.userId).profile.partnerOrg;

  return Events.find(selector);
});
