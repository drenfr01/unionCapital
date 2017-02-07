/* global EventCategories:true */
/* global R */
/* global getInitialCategoryData:true */

EventCategories = new Meteor.Collection('eventCategories');

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
        name: 'Reading/In-home learning with child',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS','ONE_MAX_ENTRY_PER_DAY'],
      },
      {
        name: 'In-school Meeting',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'In-school Event',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'In-school Volunteer',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Chaperone Field Trip/Sport Activity',
        rules: ['LESS_THAN_OR_EQUAL_4_HOURS'],
      },
      {
        name: 'Adult Education Class',
        rules: ['LESS_THAN_OR_EQUAL_4_HOURS'],
      },
      {
        name: 'Library/Education Center',
        rules: ['LESS_THAN_OR_EQUAL_4_HOURS'],
      },
      {
        name: 'Early Childhood Playgroup',
        rules: ['LESS_THAN_OR_EQUAL_4_HOURS'],
      },
    ],
  },
  'Health': {
    icon: 'glyphicon-plus',
    version: 2,
    categories: [
      {
        name: 'Walking/In-home Exercise',
        rules: ['ONE_MAX_ENTRY_PER_DAY'],
      },
      {
        name: 'Running, Biking, Team Sport',
        rules: ['ONE_MAX_ENTRY_PER_DAY'],
      },
      {
        name: 'Gym/Fitness Center Exercise',
        rules: ['ONE_MAX_ENTRY_PER_DAY'],
      },
      {
        name: 'Health Center Appointment',
        rules: ['ONE_MAX_ENTRY_PER_DAY'],
      },
      {
        name: 'Hospital Visit',
        rules: ['ONE_MAX_ENTRY_PER_DAY'],
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
        name: 'Farmers Market',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'EBNHC - Asthma Management',
        rules: ['SUPER_ADMIN_ONLY'],
      },
    ],
  },
  'Finance': {
    icon: 'glyphicon-usd',
    version: 2,
    categories: [
      {
        name: 'FII Monthly Meeting',
        rules: ['SUPER_ADMIN_ONLY'],
      },
      {
        name: 'Lending Circles Meeting',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Financial Workshop',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Home Buying Workshop/Class',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Financial Advisor Meeting',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Opening New Bank Account',
        rules: [],
      },
      {
        name: 'Tax Services',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
    ],
  },
  'Community': {
    icon: 'glyphicon-home',
    version: 2,
    categories: [
      {
        name: 'Volunteer: Organization',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Volunteer: Event',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Volunteer: Helping Others',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Performance/Festival',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Workshop/Info Session',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Community Meeting',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Leading/Teaching an Event/Workshop',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Voter Registration/Engagement',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Advocacy Event/Rally',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Political Activity',
        rules: ['LESS_THAN_OR_EQUAL_2_HOURS'],
      },
      {
        name: 'Cooking for an Event',
        rules: ['ONE_MAX_ENTRY_PER_DAY:'],
      },
      {
        name: 'Donating clothing/goods',
        rules: ['ONE_MAX_ENTRY_PER_DAY:'],
      },
      {
        name: 'OTHER: Type in Description',
        rules: ['SUPER_ADMIN_ONLY'],
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
    R.mapObjIndexed(({ version, categories }, superCategoryName) => R.map(cat => ({ superCategoryName, version, ...cat, deleteInd: false }), categories))
  )(categoriesBySuperCategory);
};
