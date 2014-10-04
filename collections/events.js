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
    allowedValues: institutions,
    optional: true
  },
  category: {
    type: String,
    label: 'Category of Event',
    allowedValues: eventCategories,
    optional: true
  },
  active: {
    type: Number,
    label: 'Is event active?',
    allowedValues: [0,1],
    defaultValue: 1
  },
  startDate: {
    type: Date,
    label: 'Start of Event'
  },
  endDate: {
    type: Date,
    label: 'End of Event'
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

Events.currentEvents = function(startWeekDate, endWeekDate) {
  return Events.find({startDate: {'$lte': endWeekDate}, 
                     endDate: {'$gte': startWeekDate}, 
                     active: 1},
                     {sort: {startDate: 1}});
};

Events.upcomingEvents = function() {
  return Events.find({startDate: {'$gt': new Date()}, active: 1},
                     {sort: {startDate: 1}});
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
