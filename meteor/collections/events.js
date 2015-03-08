EventCategories = new Meteor.Collection('eventCategories');

EventCategories.attachSchema({
  name: {
    type: String,
    label: 'Category Name'
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion'
  }
});

EventOrgs = new Meteor.Collection('eventOrgs');

Events = new Meteor.Collection('events');
Events.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'Name of Event'
  },
  address: {
    type: String,
    label: 'Address of Event'
  },
  longitude: {
    type: String,
    label: 'Longitude',
    optional: true
  },
  latitude: {
    type: String,
    label: 'Latitude',
    optional: true
  },
  description: {
    type: String,
    label: 'Description of Event'
  },
  institution: {
    type: String,
    label: 'Affiliated Institution',
    optional: true
  },
  category: {
    type: String,
    label: 'Category of Event',
    optional: true
  },
  deleteInd: {
    type: Boolean,
    label: 'Logical Deletion',
    defaultValue: false
  },
  eventDate: {
    type: Date,
    label: 'Date event occurs'
  },
  points: {
    type: Number,
    label: 'Amount of Points',
    optional: true
  },
  isPointsPerHour: {
    type: Boolean,
    label: 'Points per Hour?'
  },
  pointsPerHour: {
    type: Number,
    label: 'Points per Hour',
    optional: true
  },
  url: {
    type: String,
    label: 'URL to the event',
    optional: true
  }
}));

Events.calculateStartEndDates = function(offset) {
  var currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  //set start of week date
  currentDate.setDate(currentDate.getDate() + (offset - 7));
  var startWeekDate = new Date(currentDate);
  currentDate = new Date();
  currentDate.setHours(23,59,59,59);

  //set end of week date
  currentDate.setDate(currentDate.getDate() + offset);
  var endWeekDate = new Date(currentDate);
  return [startWeekDate, endWeekDate];
};

Events.pastEvents = function() {
  var currentDate = new Date();
  return Events.find({eventDate: {'$lte': currentDate}, deleteInd: false},
                     {sort: {eventDate: 1}});
};

Events.currentEvents = function() {
  var currentDate = new Date();
  return Events.find({eventDate: {'$gte': currentDate}, deleteInd: false},
                     {sort: {eventDate: 1}});
};


Events.allEvents = function() {
  return Events.find({endDate: {'$gte': new Date()}, active: 1},
                     {sort: {startDate: 1}});
};

Events.allow({
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
