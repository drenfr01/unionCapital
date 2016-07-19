/* global R */
/* global Transactions */
/* global moment */

import { userHasPermissionToAccessMemberDataForPartnerOrg } from './imports/permissions';

function isDataFresh(chartDataForConfiguration) {
  const SECONDS_TO_LIVE = 3600;
  return moment().diff(chartDataForConfiguration.timeCaculatedAt, 'seconds') < SECONDS_TO_LIVE;
}

//const Timer = function() {};

//Timer.prototype.start = function() {
  //console.log('start');
  //this.lastTime = moment();
//};

//Timer.prototype.log = function(note) {
  //const diff = moment().diff(this.lastTime, 'milliseconds');
  //console.log(diff);
  //console.log(note);
  //this.lastTime = moment();
//};

//const timer = new Timer();

const getPoints = R.compose(
  R.defaultTo(0),
  R.ifElse(
    R.compose(R.prop('isPointsPerHour'), R.propOr({}, 'event')),
    R.compose((trans) => R.compose(R.prop('pointsPerHour'), R.prop('event'))(trans) * R.prop('timeSpent')(trans)),
    R.compose(R.prop('points'), R.propOr({}, 'event'))
  )
);

function calculatePointsWithUserData(runningTotal, trans) {
  return runningTotal + getPoints(trans);
}

const sumPointsForUser = R.curry(function(allUsersDict, userTransactions) {
  return R.reduce(calculatePointsWithUserData, 0, userTransactions);
});

const joinUserToTransaction = R.curry(function(allUsersDict, transaction) {
  return {
    ...allUsersDict[transaction.userId],
    ...transaction,
  };
});

function getPointDataForPartnerOrg(field, transactionsForPartnerOrg, allUsersDict) {
  return R.compose(
    R.map(sumPointsForUser(allUsersDict)),
    R.groupBy(R.prop(field)),
    //R.tap(console.log.bind(console)),
    R.map(joinUserToTransaction(allUsersDict))
  )(transactionsForPartnerOrg);
}

const getUsersDict = R.compose(
  R.map(R.prop('profile')),
  R.indexBy(R.prop('_id'))
);

function getTransactionsForPartnerOrg(partnerOrg) {
  // project the fields for performance
  const transactionsOptions = {
    fields: {
      userId: 1,
      timeSpent: 1,
      category: 1,
      approvalType: 1,
      'event.isPointsPerHour': 1,
      'event.pointsPerHour': 1,
      'event.points': 1,
    },
  };

  return Transactions.find({ partnerOrg: partnerOrg }, transactionsOptions).fetch();
}

function getAllUsers() {
  return Meteor.users.find({}).fetch();
}

function getChartData(field, partnerOrg) {
  const transactionsForPartnerOrg = getTransactionsForPartnerOrg(partnerOrg);
  const allUsersDict = getUsersDict(getAllUsers());
  return getPointDataForPartnerOrg(field, transactionsForPartnerOrg, allUsersDict);
}

export function getDataForPartnerOrg(field, partnerOrg) {
  return {
    timeCaculatedAt: moment(),
    chartData: getChartData(field, partnerOrg),
  };
}

Meteor.methods({
  refreshChartData: function(field, partnerOrg) {
    check(field, String);
    check(partnerOrg, String);

    this.unblock();

    if (!userHasPermissionToAccessMemberDataForPartnerOrg(this.userId, partnerOrg)) {
      throw new Meteor.Error('INVALID_PERMISSONS');
    }

    const doc = {
      $set: {
        [field]: getDataForPartnerOrg(field, partnerOrg),
      },
    };

    MemberEngagementData.upsert({ _id: partnerOrg }, doc);
  },
});
