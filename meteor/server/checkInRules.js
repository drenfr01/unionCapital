/* eslint-disable no-console */
/* global CheckInRules:true */
/* global getApprovalType:true */
/* global DecisionTree */
/* global AppConfig */
/* global Events */
/* global HelperFunctions */
/* global Images */
/* global Transactions */
/* global moment */
/* global R */
/* global testCheckIn:true */

const options = {
  // Max distance for ad hoc event in km
  maxAdHocDistance: AppConfig.checkIn.maxAdHocDistance,
  // Max distance for recognized event in km
  maxEventDistance: AppConfig.checkIn.maxEventDistance,
};

// this is the priority of permission levels that a user is eligible for
// the algorithm will choose the topmost one available
const ORDERED_PERMISSION_LEVELS = [
  'AUTO',
  'PARTNER_ADMIN',
  'SUPER_ADMIN',
  'NOT_ALLOWED',
];

const CATEGORY_RULES_FUNCTIONS = {
  LESS_THAN_OR_EQUAL_2_HOURS: function({ hoursSpent }) {
    return hoursSpent <= 2;
  },

  LESS_THAN_OR_EQUAL_4_HOURS: function({ hoursSpent }) {
    return hoursSpent <= 4;
  },

  ONE_MAX_ENTRY_PER_DAY: function({ userId, category, transactionDate }) {
    const earliestDate = moment(transactionDate).startOf('day').toDate();
    const latestDate = moment(transactionDate).endOf('day').toDate();
    const count = Transactions.find({
      userId,
      'event.category': category,
      transactionDate: {
        $gte: earliestDate,
        $lt: latestDate,
      },
    }).count();

    return count === 0;
  },

  OTHER: function() {
    return true;
  },
};

const PERMISSION_RULES = {
  AUTO: {
    $or: [{
      IS_RECOGNIZED_EVENT: true,
      IS_CURRENT_EVENT: true,
      HAS_GEOLOCATION: true,
      IN_RANGE: true,
    }, {
      IS_RECOGNIZED_EVENT: false,
      SATISFIES_AUTO_SELFIE_RULES: true,
      $or: [{
        HAS_PHOTO: true,
      }, {
        HAS_DESCRIPTION: true,
      }],
    }],
    IS_RECENT: true,
  },
  PARTNER_ADMIN: {
    $or: [{
      IS_RECOGNIZED_EVENT: true,
      HAS_PHOTO: false,
    }, {
      IS_RECOGNIZED_EVENT: false,
      HAS_GEOLOCATION: true,
      IS_RECOGNIZED_LOCATION: true,
    }],
    IS_RECENT: true,
  },
  SUPER_ADMIN: {
    $or: [{
      IS_RECOGNIZED_EVENT: false,
      SATISFIES_ADMIN_SELFIE_RULES: true,
    }, {
      IS_RECOGNIZED_EVENT: true,
    }],
  },
  NOT_ALLOWED: {
    TRUE: true,
  },
};

function areSelfieRulesMet(membershipList, valueToEqual, attributes) {
  return R.compose(
    R.all(R.equals(valueToEqual)),
    R.map(rule => CATEGORY_RULES_FUNCTIONS[rule](attributes)),
    R.filter(rule => membershipList.indexOf(rule) > -1),
  )(attributes.rules);
}

const REQUREMENTS_FUNCTIONS = {
  TRUE: () => true,

  SATISFIES_AUTO_SELFIE_RULES: function(attributes) {
    const autoRulesTrue = ['ONE_MAX_ENTRY_PER_DAY', 'LESS_THAN_OR_EQUAL_2_HOURS', 'LESS_THAN_OR_EQUAL_4_HOURS'];
    return areSelfieRulesMet(autoRulesTrue, true, attributes);
  },

  SATISFIES_ADMIN_SELFIE_RULES: function(attributes) {
    const adminRulesFalse = ['LESS_THAN_OR_EQUAL_2_HOURS', 'LESS_THAN_OR_EQUAL_4_HOURS'];
    const adminRulesTrue = ['OTHER_CATEGORY'];
    return areSelfieRulesMet(adminRulesFalse, false, attributes) && areSelfieRulesMet(adminRulesTrue, true, attributes);
  },

  HAS_PHOTO: function({ imageId }) {
    return !!Images.findOne({ _id: imageId });
  },

  HAS_DESCRIPTION: function({ eventDescription }) {
    return !!eventDescription;
  },

  IS_RECOGNIZED_EVENT: function({ eventId }) {
    return !!Events.findOne({ _id: eventId });
  },

  HAS_GEOLOCATION: function({ userLat, userLng }) {
    return !!userLat && !!userLng;
  },

  IS_RECOGNIZED_LOCATION: function({ userLat, userLng }) {
    const events = Events.find({ adHoc: false, deleteInd: false }).fetch();
    const closeEvent = _.find(events, function(oneEvent) {
      return HelperFunctions.haversineFormula(oneEvent, userLng, userLat) < options.maxAdHocDistance;
    });
    return !!closeEvent;
  },

  IN_RANGE: function({ userId, eventId, userLng, userLat }) {

    // Verify that the user has not already checked in
    const event = Events.findOne(eventId);
    if (!event) {
      return false;
    }

    if(Transactions.findOne({ userId, eventId })) {
      throw new Meteor.Error(400, "You have already checked into this event");
    }

    // Calculate the distance between the user and the event
    const distance = HelperFunctions.haversineFormula(event, userLng, userLat);

    // Check to see if it is in range
    if(distance <= options.maxEventDistance) {
      return true;
    }
    return false;
  },

  IS_CURRENT_EVENT: function({ eventId }) {
    const thisEvent = Events.findOne({ _id: eventId });

    if (thisEvent) {
      const thisEventMoment = moment(thisEvent.eventDate);
      const minStartDate = moment().add(AppConfig.checkIn.today.hoursBehind, 'h');
      const maxEndDate = moment().add(AppConfig.checkIn.today.hoursAhead, 'h');

      return thisEventMoment.isBetween(minStartDate, maxEndDate, 'second');
    }
    return false
  },

  IS_RECENT: function({ eventDate }) {
    return !!eventDate && moment(new Date()).add(-1, 'weeks').isBefore(moment(new Date(eventDate)));
  },
};

// val: boolean, key: functionName -> boolean
// val: array, key: '$or' -> boolean
const areRequirementsMetForNode = R.curry(function(attributes, requirementFunctions, val, key) {
  if (key === '$or') {
    return checkForAnyValidPath(attributes, requirementFunctions, val);
  }

  if (typeof val === 'boolean') {
    return requirementFunctions[key](attributes) === val;
  }

  throw new Error('Not $or or boolean');
});

// requirementsDict -> boolean
const areAllRequirementsMetForDict = R.curry(function(attributes, requirementFunctions, requirementsDict) {
  return R.compose(
    R.all(R.equals(true)),
    R.values,
    R.mapObjIndexed(areRequirementsMetForNode(attributes, requirementFunctions)),
  )(requirementsDict);
});

const chooseMostPermissive = R.curry(function(orderedPermissionLevels, permissionOutput) {
  return R.compose(
    R.invoker(0, 'toLowerCase'),
    R.head,
    R.sortBy(permissionLevel => orderedPermissionLevels.indexOf(permissionLevel)),
    R.keys,
    R.filter(R.equals(true))
  )(permissionOutput);
});

const checkForAnyValidPath = function(attributes, requirementFunctions, val) {
  return R.compose(
    R.any(R.equals(true)),
    R.map(areAllRequirementsMetForDict(attributes, requirementFunctions)),
  )(val);
};

const getPermissionMap = (attributes, requirementFunctions) => R.map(areAllRequirementsMetForDict(attributes, requirementFunctions));

function resolveCheckIn(attributes, orderedPermissionLevels, requirementFunctions, rules) {
  return R.compose(
    chooseMostPermissive(orderedPermissionLevels),
    getPermissionMap(attributes, requirementFunctions)
  )(rules);
}

getApprovalType = function getApprovalType(attributes) {
  check(attributes, {
    userId: String,
    hoursSpent: Number,
    eventId: Match.Optional(String),
    imageId: Match.Optional(String),
    eventName: Match.Optional(String),
    eventDescription: Match.Optional(String),
    eventDate: Match.Optional(Date),
    category: Match.Optional(String),
    userLat: Match.Optional(Number),
    userLng: Match.Optional(Number),
    addons: Match.Optional([Object]),
    rules: [String],
  });

  return resolveCheckIn(attributes, ORDERED_PERMISSION_LEVELS, REQUREMENTS_FUNCTIONS, PERMISSION_RULES);
};

// auto approved for any successful geolocation
function test1() {
  const attributes = {
    eventDescription: 'hello',
    hoursSpent: 1,
    eventId: 'jh4v9GAhvuBYvWGJ1',
    rules: ['LESS_THAN_OR_EQUAL_2_HOURS', 'ONE_MAX_ENTRY_PER_DAY', 'LESS_THAN_OR_EQUAL_4_HOURS'],
  };

  const testFuncs = {
    HAS_PHOTO: () => false,
    IS_RECOGNIZED_EVENT: () => true,
    IS_CURRENT_EVENT: () => true,
    HAS_GEOLOCATION: () => true,
    IS_RECOGNIZED_LOCATION: () => true,
    IN_RANGE: () => true,
    IS_RECENT: () => true,
    SATISFIES_AUTO_SELFIE_RULES: () => false,
    SATISFIES_ADMIN_SELFIE_RULES: () => false,
    HAS_DESCRIPTION: () => true,
    TRUE: () => true,
  };
  const result = resolveCheckIn(attributes, ORDERED_PERMISSION_LEVELS, testFuncs, PERMISSION_RULES);

  console.log(result === 'auto' ? 'pass' : 'fail');
}

// admin approved for no geolocation
function test2() {
  const attributes = {
    eventDescription: 'hello',
    hoursSpent: 1,
    eventId: 'jh4v9GAhvuBYvWGJ1',
    rules: ['LESS_THAN_OR_EQUAL_2_HOURS', 'ONE_MAX_ENTRY_PER_DAY', 'LESS_THAN_OR_EQUAL_4_HOURS'],
  };

  const testFuncs = {
    HAS_PHOTO: () => false,
    IS_RECOGNIZED_EVENT: () => true,
    IS_CURRENT_EVENT: () => true,
    HAS_GEOLOCATION: () => false,
    IS_RECOGNIZED_LOCATION: () => true,
    IN_RANGE: () => true,
    IS_RECENT: () => true,
    SATISFIES_AUTO_SELFIE_RULES: () => false,
    SATISFIES_ADMIN_SELFIE_RULES: () => true,
    HAS_DESCRIPTION: () => true,
    TRUE: () => true,
  };
  const result = resolveCheckIn(attributes, ORDERED_PERMISSION_LEVELS, testFuncs, PERMISSION_RULES);

  console.log(result);
  console.log(result === 'super_admin' ? 'pass' : 'fail');
}

testCheckIn = function() {
  test1();
  test2();
};
