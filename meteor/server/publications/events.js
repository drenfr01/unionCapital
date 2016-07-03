/* global AppConfig */
/* global PartnerOrgs */
/* global Roles */
/* global Counts */
/* global Transactions */
/* global Events */
/* global R */
/* global EventCategories */

const ALL_CATEGORIES = 'All';
const ALL_SUPER_CATEGORIES = 'All';

function getPrimaryPartnerOrgName(user) {
  return R.head(user.profile.partnerOrg);
}

Meteor.publish("events", function(start, end) {
  var selector = {};
  selector.deleteInd = false;
  selector.adHoc = false;
  selector.eventDate = { $gte: start, $lte: end };

  var user = Meteor.users.findOne(this.userId);
  var listOfPartnerOrgs = PartnerOrgs.find({name: {$in: user.profile.partnerOrg}}).fetch();
  
  if(R.isNil(listOfPartnerOrgs)) {
    console.log("partnerOrg undefined");
  };

  selector = _.extend(selector, {$or: [
    {privateEvent: false},
    {privateWhitelist: this.userId},
    {privateWhitelist: {$in: R.pluck('_id', listOfPartnerOrgs)}}
  ]});


  return Events.find(selector);
});


Meteor.publish("calendarEvents", function(selector, options, searchText, skipCount) {
  check(skipCount, Match.Maybe(Number));
  var selector = selector || {};
  var options = options || {};

  selector.deleteInd = false;
  selector.adHoc = false;

  var user = Meteor.users.findOne(this.userId);
  var listOfPartnerOrgs = PartnerOrgs.find(
    {name: {$in: user.profile.partnerOrg}}).fetch();
  
  if(searchText) {
    console.log(searchText);
    selector = _.extend(selector, 
      {name: {$regex: searchText, $options: "i"}}
    );
  }

  if(R.isNil(listOfPartnerOrgs)) {
    console.log("partnerOrg undefined");
  };

  selector = _.extend(selector, {$or: [
    {privateEvent: false},
    {privateWhitelist: this.userId},
    {privateWhitelist: {$in: R.pluck('_id', listOfPartnerOrgs)}}
  ]});

  const eventOptions = {
    limit: AppConfig.public.recordsPerPage,
    skip: skipCount,
    sort: {eventDate: 1}
  };

  Counts.publish(this, 'calendarCount', Events.find(selector), {
    noReady: true
  });

  return Events.find(selector, eventOptions);
});

Meteor.publish("singleEvent", function(id) {
  if (!id) {
    throw new Error('Bad event id in subscription');
  }

  return Events.find({ _id: id });
});

//this is used in two places. Once for an admin or 
//partner admin to check a user's points and then
//another for a user to check their own points
//NOTE: this only returns non-selfie events
Meteor.publish("eventsForUser", function(userId) {
  var self = this;

  check(userId, Match.Optional(String));

  //set the userId if the user is checking their own points
  if (!Roles.userIsInRole(self.userId, ['admin', 'partnerAdmin'])) {
    userId = self.userId;
  }

  var eventIds = Transactions.find({ userId: userId }, 
                                   { fields: { eventId: 1 } }
                                  ).fetch();
  return Events.find({ _id: { $in: eventIds } });
});

Meteor.publish('eventHistoryForUser', function() {
  return Transactions.find({ userId: this.userId });
});

Meteor.publish("eventsForTransactions", function() {
  var self = this;
  var selector = { approved: false, deleteInd: false };

  if (Roles.userIsInRole(self.userId, 'partnerAdmin')) {
    // Uses the partner admin's org to filter if not superadmin
    selector.approvalType = 'partner_admin';
    selector.partnerOrg = Meteor.users.findOne(self.userId).primaryPartnerOrg();
  }

  var eventIds = _.chain(Transactions.find(selector, { fields: { eventId: 1 } }).fetch())
                  .pluck('eventId')
                  .uniq()
                  .value();

  return Events.find({ _id: { $in: eventIds } });
});


function buildManageEventsSelector(userId, range, institution, category, superCategory, searchText) {
  let selector = { deleteInd: false };
  const currentDate = new Date();

  //double check to make sure admin users can't manage other events
  if (Roles.userIsInRole(userId, 'partnerAdmin')) {
    selector.institution = Meteor.users.findOne(userId).primaryPartnerOrg();
  } else {
    if(institution && institution !== ALL_CATEGORIES) {
      selector.institution = institution;
    }
  }

  if(category && category !== ALL_CATEGORIES) {
    selector.category = category;
  } else if (!category && superCategory && superCategory !== ALL_SUPER_CATEGORIES) {
    const catsInSuper = EventCategories.getCategoriesForSuperCategory(superCategory);
    selector.category = { $in: catsInSuper };
  }

  if(range === AppConfig.eventRange.current) {
    selector.eventDate = {'$gte': currentDate}
  } else if (range === AppConfig.eventRange.past) {
    selector.eventDate = {'$lt': currentDate};
  }

  if(searchText) {
    selector = _.extend(selector, {name: {$regex: searchText, $options: "i"}});
  }

  return selector;
}

Meteor.publish('manageEvents', function(range, institution, category, superCategory, searchText, skipCount) {
  check(range, String);
  check(skipCount, Number);
  check(institution, Match.Maybe(String));
  check(superCategory, Match.Maybe(String));
  check(category, Match.Maybe(String));

  const selector = buildManageEventsSelector(this.userId, range, institution, 
                                             category, superCategory, searchText);
  const eventOptions = {
    limit: AppConfig.public.recordsPerPage,
    skip: skipCount,
  };

  Counts.publish(this, 'eventsCount', Events.find(selector), { noReady: true });
  return Events.find(selector, eventOptions);
});
