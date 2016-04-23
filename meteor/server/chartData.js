const getPoints = R.compose(
  R.defaultTo(0),
  R.ifElse(
    R.compose(R.prop('isPointsPerHour'), R.propOr({}, 'event')),
    R.compose((trans) => R.compose(R.prop('pointsPerHour'), R.prop('event'))(trans) * R.prop('timeSpent')(trans)),
    R.compose(R.prop('points'), R.propOr({}, 'event'))
  )
);

function getPointDataForPartnerOrg(field, transactionsForPartnerOrg, allUsersDict) {
  return R.compose(
    R.map(sumPointsForUser(allUsersDict)),
    R.groupBy(R.prop('_id'))
  )(transactionsForPartnerOrg);
}

function addPointsAndUserData(acc, trans) {
  return {
    ...acc,
    totalPoints: R.defaultTo(0, acc.totalPoints) + getPoints(trans),
  };
}

const toDict = R.reduce((acc, val) => ({ ...acc, [val._id]: val.profile }), {});

const sumPointsForUser = R.curry(function(allUsersDict, userTransactions) {
  return R.reduce(addPointsAndUserData, allUsersDict[userTransactions[0].userId])(userTransactions);
});

function getChartData(field) {
  const partnerOrg = 'Family Independence Initiative';
  const transactionsForPartnerOrg = Transactions.find({ partnerOrg: partnerOrg }).fetch();
  const allUsersDict = toDict(Meteor.users.find({}).fetch());
  return getPointDataForPartnerOrg(field, transactionsForPartnerOrg, allUsersDict);
}

Meteor.methods({
  getChartData: function(field) {
    const pointDataForPartnerOrg = getChartData(field);
    return pointDataForPartnerOrg;
  },
});