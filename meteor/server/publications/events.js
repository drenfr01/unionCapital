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


function buildManageEventsSelector(userId, range, institution, category, searchText) 
{

  var selector = {deleteInd: false};
  var currentDate = new Date();

  //double check to make sure admin users can't manage other events
  if (Roles.userIsInRole(userId, 'partnerAdmin')) {
    selector.institution = Meteor.users.findOne(userId).profile.partnerOrg;
  } else {
    //TODO: make All a config value
    if(institution && institution !== "All") {
      selector.institution = institution;
    }
  }

  //TODO: make All a config value
  if(category && category !== "All") {
    selector.category = category;
  }

  if(range === AppConfig.eventRange.current) {
    selector.eventDate = {'$gte': currentDate}

  } else if (range === AppConfig.eventRange.past) {
    selector.eventDate = {'$lt': currentDate};
    
  } else {
    //TODO: throwing an error doesn't work here, for some reason it gets
    //silenced..
    return new Meteor.Error("INCORRECT_PARAMETER","parameter should be either current or past");
  }

  if(searchText) {
    selector = _.extend(selector, {name: {$regex: searchText, $options: "i"}});
  };

  return selector;
}

Meteor.publish('manageEvents', function(range, institution, category, 
                                        searchText, skipCount) {
  check(range, String);
  check(skipCount, Number);
  //TODO there is a known bug with Match.Optional where it doesn't work with
  //nulls, and DDP coerces undefineds to null. Uncomment & switch to Match.Maybe
  //when we bump to 1.3
  //check(institution, Match.Optional(String));
  //check(category, Match.Optional(String));

  var selector = buildManageEventsSelector(this.userId, range, institution,
                                           category, searchText);
  console.log(selector);

  Counts.publish(this, 'eventsCount', Events.find(selector), {
    noReady: true
  });

  var eventOptions = {limit: AppConfig.public.recordsPerPage, skip: skipCount};
  return Events.find(selector, eventOptions);
});
