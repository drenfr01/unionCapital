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
        rules: [],
      },
      {
        name: 'In-school Meeting',
        rules: [],
      },
      {
        name: 'In-school Event',
        rules: [],
      },
      {
        name: 'In-school Volunteer',
        rules: [],
      },
      {
        name: 'Chaperone Field Trip/Sport Activity',
        rules: [],
      },
      {
        name: 'Adult Education Class',
        rules: [],
      },
      {
        name: 'Library/Education Center',
        rules: [],
      },
      {
        name: 'Early Childhood Playgroup',
        rules: [],
      },
    ],
  },
  'Health': {
    icon: 'glyphicon-plus',
    version: 2,
    categories: [
      {
        name: 'Walking/In-home Exercise',
        rules: [],
      },
      {
        name: 'Running, Biking, Team Sport',
        rules: [],
      },
      {
        name: 'Gym/Fitness Center Exercise',
        rules: [],
      },
      {
        name: 'Health Center Appointment',
        rules: [],
      },
      {
        name: 'Hospital Visit',
        rules: [],
      },
      {
        name: 'Fitness Class',
        rules: [],
      },
      {
        name: 'Health Workshop',
        rules: [],
      },
      {
        name: 'Farmers Market',
        rules: [],
      },
    ],
  },
  'Finance': {
    icon: 'glyphicon-usd',
    version: 2,
    categories: [
      {
        name: 'FII Monthly Meeting',
        rules: [],
      },
      {
        name: 'Lending Circles Meeting',
        rules: [],
      },
      {
        name: 'Financial Workshop',
        rules: [],
      },
      {
        name: 'Home Buying Workshop/Class',
        rules: [],
      },
      {
        name: 'Financial Advisor Meeting',
        rules: [],
      },
      {
        name: 'Opening New Bank Account',
        rules: [],
      },
      {
        name: 'Tax Services',
        rules: [],
      },
    ],
  },
  'Community': {
    icon: 'glyphicon-home',
    version: 2,
    categories: [
      {
        name: 'Volunteer: Organization',
        rules: [],
      },
      {
        name: 'Volunteer: Event',
        rules: [],
      },
      {
        name: 'Volunteer: Helping Others',
        rules: [],
      },
      {
        name: 'Performance/Festival',
        rules: [],
      },
      {
        name: 'Workshop/Info Session',
        rules: [],
      },
      {
        name: 'Community Meeting',
        rules: [],
      },
      {
        name: 'Leading/Teaching an Event/Workshop',
        rules: [],
      },
      {
        name: 'Voter Registration/Engagement',
        rules: [],
      },
      {
        name: 'Advocacy Event/Rally',
        rules: [],
      },
      {
        name: 'Political Activity',
        rules: [],
      },
      {
        name: 'Cooking for an Event',
        rules: [],
      },
      {
        name: 'Donating clothing/goods',
        rules: [],
      },
      {
        name: 'OTHER: Type in Description',
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
  const categories = EventCategories.find({ deleteInd: { $ne: true } }).fetch();
  const minVersionNumber = legacy ? 0 : getMaxVersionNumber(categories);
  return categories.filter(cat => cat.version >= minVersionNumber);
}

EventCategories.getSuperCategories = function getSuperCategories(legacy = false) {
  const categories = getCategories(legacy);
  return R.compose(
    R.map(name => ({ name, icon: categoriesBySuperCategory[name].icon })),
    R.uniq,
    R.pluck('superCategoryName'),
  )(categories);
};

EventCategories.getAllCategories = function getAllCategories(legacy = false) {
  const categories = getCategories(legacy);
  return R.pluck('name', categories);
};

EventCategories.getCategoriesForSuperCategory = function getCategoriesForSuperCategory(superCategoryName) {
  if (!superCategoryName) {
    return [];
  }

  const categories = EventCategories.find({ superCategoryName, deleteInd: { $ne: true } }).fetch();
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
