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

Meteor.publish('manageEvents', function(range, institution, category) {
  //var self = this;
  check(range, String);
  var selector = {deleteInd: false};
  var currentDate = new Date();

  //double check to make sure admin users can't manage other events
  if (Roles.userIsInRole(this.userId, 'partnerAdmin')) {
    selector.institution = Meteor.users.findOne(self.userId).profile.partnerOrg;
  } else {
    if(institution) {
      selector.institution = institution;
    }
  }

  if(category) {
    selector.category = category;
  }

  if(range === AppConfig.eventRange.current) {
    selector = _.extend(selector, {
      $where: function() {
        return moment(this.eventDate).add(this.duration, 'h').isAfter(moment());
      }
    });

  } else if (range === AppConfig.eventRange.past) {
    selector.eventDate = {'$lt': currentDate};
    
  } else {
    throw new Meteor.Error("INCORRECT_PARAMETER","parameter should be either current or past");
  }

  return Events.find(selector);
});
