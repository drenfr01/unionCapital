IncomeBrackets = new Meteor.Collection('incomeBrackets');

IncomeBrackets.attachSchema(new SimpleSchema({
  bracket: {
    type: String,
    label: 'Income Bracket'
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion'
  }
}));

PartnerOrgs = new Meteor.Collection('partnerOrganizations');

PartnerOrgs.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'Organization Name'
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion'
  }
}));

Kids = new Meteor.Collection('kids');

Kids.attachSchema(new SimpleSchema({
  number: {
    type: String,
    label: 'Number of Kids'
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion'
  }
}));

Races = new Meteor.Collection('races');

Races.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'Race'
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion'
  }
}));

Ethnicities = new Meteor.Collection('ethnicities');

Ethnicities.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'Ethnicity'
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion'
  }
}));


