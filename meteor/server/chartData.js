/* global R */
/* global Transactions */

const getPoints = R.compose(
  R.defaultTo(0),
  R.ifElse(
    R.compose(R.prop('isPointsPerHour'), R.propOr({}, 'event')),
    R.compose((trans) => R.compose(R.prop('pointsPerHour'), R.prop('event'))(trans) * R.prop('timeSpent')(trans)),
    R.compose(R.prop('points'), R.propOr({}, 'event'))
  )
);

function calculatePointsWithUserData(acc, trans) {
  acc.calculatedTotalPoints = R.defaultTo(0, acc.calculatedTotalPoints) + getPoints(trans);
  return acc;
}

const sumPointsForUser = R.curry(function(allUsersDict, userTransactions) {
  const userProfile = allUsersDict[userTransactions[0].userId];
  return R.reduce(calculatePointsWithUserData, userProfile, userTransactions);
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
    R.map(joinUserToTransaction(allUsersDict))
  )(transactionsForPartnerOrg);
}

const getUsersDict = R.compose(
  R.map(R.prop('profile')),
  R.indexBy(R.prop('_id'))
);

function getChartData(field) {
  const partnerOrg = 'Family Independence Initiative';
  const transactionsForPartnerOrg = Transactions.find({ partnerOrg: partnerOrg }).fetch();
  const allUsersDict = getUsersDict(Meteor.users.find({}).fetch());
  return getPointDataForPartnerOrg(field, transactionsForPartnerOrg, allUsersDict);
}

Meteor.methods({
  getChartData: function(field) {
    const pointDataForPartnerOrg = getChartData(field);
    return pointDataForPartnerOrg;
  },
});
