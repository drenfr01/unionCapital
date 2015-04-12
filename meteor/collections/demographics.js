PartnerOrgSectors = new Meteor.Collection('partnerOrgSectors');

PartnerOrgSectors.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'Income Bracket'
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion'
  }
}));


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
  description: {
    type: String,
    label: 'Organization Description',
    optional: true
  },
  sector: {
    type: String,
    label: 'Classification of Org'
  },
  membersReported: {
    type: Number,
    label: 'Number of members organization has'
  },
  ucbMembers: {
    type: Number,
    label: 'Number of UCB members attributed to this org',
    optional: true
  },
  totalPoints: {
    type: Number,
    label: 'Total points of all members registered to this org',
    optional: true
  },
  lastEventSponsored: {
    type: Date,
    label: 'Date of last event by this org',
    optional: true
  },
  nextEventSponsored: {
    type: Date,
    label: 'Date of next event by this org',
    optional: true
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion'
  }
}));

PartnerOrgs.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
});

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

NumberOfPeople = new Meteor.Collection('numberOfPeople');

NumberOfPeople.attachSchema(new SimpleSchema({
  number: {
    type: String,
    label: 'Number of Reservations'
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion'
  }
}));
