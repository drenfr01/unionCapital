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
Feedback = new Mongo.Collection('feedback');

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
    optional: true //for ad-hoc events
  },
  category: {
    type: String,
    label: 'Category of Event'
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
  endTime: {
    type: Date,
    label: 'End Time of Event',
    //can be left blank for all day events
    //also difficult to do in fixture data
    optional: true
  },
  duration: {
    type: Number,
    label: 'Duration of Event in Hours',
    decimal: true
  },
  points: {
    type: Number,
    label: 'Total Points Awarded',
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
    label: 'Website',
    optional: true
  },
  numberRSVPs: {
    type: Number,
    label: 'Number of Reservations',
    optional: true
  },
  numberAttendees: {
    type: Number,
    label: 'Number of actual Attendees',
    optional: true
  },
  adHoc: {
    type: Boolean,
    label: 'Is an Ad Hoc Event'
  },
  feedback: {
    type: [Object],
    blackbox: true,
    optional: true
  },
  privateEvent: {
    type: Boolean,
    label:'Private Event?'
  },
  privateWhitelist: {
    type: [String],
    label: 'Who can see this event? Specify a user email(s) or Partner Org(s)',
    optional: true
  },
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

//TODO: refactor below two functions into one
Events.pastEvents = function(institution, category) {
  var currentDate = new Date();
  var selector = {eventDate: {'$lt': currentDate},
                     institution: institution,
                     category: category,
                     deleteInd: false
  };

  if(institution === 'All') {
    delete selector.institution;
  }

  if(category === 'All') {
    delete selector.category;
  }

  return Events.find(selector,
                     {sort: {eventDate: 1}});
};

Events.currentEvents = function(institution, category) {
  var selector = {
    $where: function() {
      return moment(this.eventDate).add(this.duration, 'h').isAfter(moment());
    },
    deleteInd: false
  };

  if(institution !== 'All')
    selector.institution = institution;

  if(category !== 'All')
    selector.category = category;

  return Events.find(selector, {sort: {eventDate: 1}});
};


Events.allEvents = function() {
  return Events.find({endDate: {'$gte': new Date()}, active: 1},
                     {sort: {startDate: 1}});
};

Events.eventsSearch = function(searchText, selector, options) {
  selector = selector || {};
  selector.deleteInd = false;
  selector.adHoc = false;

  options = options || {};

  var out = this.find(selector, options).fetch();

  // Run a regexp on concantenated desc and name fields if searchtext is passed
  if (searchText) {
    var regExp = HelperFunctions.buildRegExp(searchText);

    out = _.filter(out, function(item) {
      var string = item.description + item.name + item.institution + item.category;

      return regExp.test(string);
    });
  }

  return out;
}

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
