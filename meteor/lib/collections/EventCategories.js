/* global EventCategories:true */
/* global R */
/* global getInitialCategoryData:true */

EventCategories = new Meteor.Collection('eventCategories');

//note: this is a re-used global, should re-factor it. 
AppConfig = {selfieEvent: "Selfie", event100Points: "Event 100 points"}

EventCategories.attachSchema({
  name: {
    type: String,
    label: 'Category Name',
  },
  superCategoryName: {
    type: String,
    label: 'SuperCategory Name',
  },
  rules: {
    type: [String],
    label: 'Rules',
  },
  eventType: {
    type: String,
    label: 'Whether it is a selfie event or not',
    optional: true
  },
  version: {
    type: Number,
    label: 'Version',
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion',
  },
});

const categoriesBySuperCategory = {
  'Education': {
    icon: 'glyphicon-education',
    version: 2,
    categories: [
      {
        name: 'In-school Meeting, Event',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'In-school Volunteer, Chaperone',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Adult Education Class, Workshop',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Chaperone Field Trip/Sport Activity',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Early Childhood Playgroup',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Reading with child',
        eventType: AppConfig.selfieEvent,
        rules: ['ONE_MAX_ENTRY_PER_DAY'],
      },
      {
        name: 'Visiting Library, Museum (non-program)',
        eventType: AppConfig.selfieEvent,
        rules: [],
      },
      {
        name: "Attending children's Sport Game, Activity",
        eventType: AppConfig.selfieEvent,
        rules: [],
      },
      {
        name: 'Helping care for other children',
        eventType: AppConfig.selfieEvent,
        rules: [],
      },
    ],
  },
  'Health': {
    icon: 'glyphicon-plus',
    version: 2,
    categories: [
      {
        name: 'Exercise program, event',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Fitness Class',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Health Workshop',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Walking, Running, Biking',
        eventType: AppConfig.selfieEvent,
        rules: ['ONE_MAX_ENTRY_PER_DAY'],
      },
      {
        name: 'Fitness Center Exercise',
        eventType: AppConfig.selfieEvent,
        rules: [],
      },
      {
        name: 'Health Center Appointment',
        eventType: AppConfig.selfieEvent,
        rules: ['ONE_MAX_ENTRY_PER_DAY'],
      },
      {
        name: 'Farmers Market, Food Cares, Fair Foods, Food Bank',
        eventType: AppConfig.selfieEvent,
        rules: [],
      },
    ],
  },
  'Finance': {
    icon: 'glyphicon-usd',
    version: 2,
    categories: [
      {
        name: 'Lending Circles, FII Meetings',
        rules: ['SUPER_ADMIN_ONLY'],
      },
      {
        name: 'Financial, Employment Workshops',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Job Fairs',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Financial Advisor Meeting',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Opening New Bank Account',
        eventType: AppConfig.selfieEvent,
        rules: [],
      },
      {
        name: 'Tax Services',
        eventType: AppConfig.selfieEvent,
        rules: [],
      },
      {
        name: 'FII Monthly Reports',
        eventType: AppConfig.selfieEvent,
        rules: [],
      },
    ],
  },
  'Community': {
    icon: 'glyphicon-home',
    version: 2,
    categories: [
      {
        name: 'Volunteer: Organization, Event',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Volunteer: Helping Others (non-family)',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Workshop, Info Session, Meeting',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Voter Engagement, Registration',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Political Activity: rally, advocacy, event',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Donating clothing, goods, food (100 points)',
        rules: ['ONE_MAX_ENTRY_PER_DAY'],
        eventType: AppConfig.event100Points
        //this just means this event will also be worth 100 points
        //It is a hack, see the eventCategories.js for the rationale
        //and see databaseAccess.js for how this is applied
      },
      {
        name: 'Attending a Performance, Festival',
        rules: ['LESS_THAN_OR_EQUAL_4_HOURS'],
      },
      {
        name: 'Attending extended-family celebrations',
        eventType: AppConfig.selfieEvent,
        rules: ['ONE_MAX_ENTRY_PER_DAY'],
      },
      {
        name: 'Service projects done in the home',
        eventType: AppConfig.selfieEvent,
        rules: [],
      },
      {
        name: 'Giving a ride to someone in need',
        eventType: AppConfig.selfieEvent,
        rules: [],
      },
    ],
  },
  'Legacy': {
    icon: 'glyphicon-ok',
    version: 1,
    categories: [
      {
        name: 'Volunteer: Organization',
        rules: [],
      },
      {
        name: 'Health (Physical & Mental)',
        rules: [],
      },
      {
        name: 'Community & Service',
        rules: [],
      },
      {
        name: 'Education (Child/Adult)',
        rules: [],
      },
      {
        name: 'Finances/Employment',
        rules: [],
      },
    ],
  },
};

function getMaxVersionNumber(categories) {
  return Math.max.apply(null, R.pluck('version', categories));
}

function getCategories(legacy) {
  const categories = EventCategories.find({ deleteInd: { $ne: true }} , 
                                          {sort: {name: 1}}).fetch();
  const minVersionNumber = legacy ? 0 : getMaxVersionNumber(categories);
  return categories.filter(cat => cat.version >= minVersionNumber);
}

EventCategories.getSuperCategories = function getSuperCategories(legacy = false) {
  const categories = getCategories(legacy);
  return R.compose(
    R.uniq,
    R.pluck('superCategoryName'),
  )(categories);
};

EventCategories.getSuperCategoryForCategory = function getSuperCategoryForCategory(categoryName) {
  const categories = getCategories(false);
  return R.compose(
    R.prop('superCategoryName'),
    R.find(R.propEq('name', categoryName))
  )(categories);
};

EventCategories.getSuperCategoriesWithIcons = function getSuperCategories(legacy = false) {
  return EventCategories
    .getSuperCategories(legacy)
    .map(name => ({ name, icon: categoriesBySuperCategory[name].icon }));
};

EventCategories.getAllCategories = function getAllCategories(legacy = false) {
  const categories = getCategories(legacy);
  return R.pluck('name', categories);
};

EventCategories.getCategoriesForSuperCategory = function getCategoriesForSuperCategory(superCategoryName) {
  if (!superCategoryName) {
    return EventCategories.getAllCategories();
  }

  const categories = EventCategories.find({ superCategoryName, deleteInd: { $ne: true } }, {sort: {name: 1}}).fetch();
  return R.compose(
    R.uniq,
    R.pluck('name')
  )(categories);
};

getInitialCategoryData = function getInitialCategoryData() {
  return R.compose(
    R.flatten,
    R.values,
    R.mapObjIndexed(({ version, categories }, superCategoryName) => R.map(cat => ({ superCategoryName, version, ...cat, 
                                                                                  eventType: cat.eventType,deleteInd: false }), categories))
  )(categoriesBySuperCategory);
};
