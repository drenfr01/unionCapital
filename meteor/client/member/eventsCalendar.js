var searchString = new ReactiveVar();
var timeframe = 'future';
//contains a list of event Ids, used to 
//avoid re-creating add to calendar links
Session.set('calendarEventsCreated', []);

Template.eventsCalendar.onRendered(function() {
  searchString.set('');
  $('.input-daterange').datepicker({ 
    orientation: "bottom auto",
    startDate: moment().format('MM/DD/YYYY'),
    autoclose: true,
    clearBtn: true
  });

  $('#startDate').val(moment().format('MM/DD/YYYY'));
  $('#endDate').val(moment().add(
      AppConfig.eventCalendar[timeframe].hoursAhead, 'h').format('MM/DD/YYYY'));
});

Template.eventsCalendar.onCreated(function() {
  this.subscribe('reservations');
  this.subscribe('numberOfPeople');
  this.subscribe('myImages');
  this.subscribe('eventCategories');
  this.superCategoryName = new ReactiveVar('default');
  var start = moment().add(
    AppConfig.eventCalendar[timeframe].hoursBehind, 'h').toDate();
  var end = moment().add(
    AppConfig.eventCalendar[timeframe].hoursAhead, 'h').toDate();
  var attributes = {
    eventDate: {
      $gte: start,
      $lte: end
    }
  };


  var template = this;
  template.autorun(function() {
    attributes = _.extend(attributes, 
                          {superCategoryName: template.superCategoryName.get()});
    var skipCount = (currentPage() - 1) * AppConfig.public.recordsPerPage;
    template.subscribe('calendarEvents', attributes, 
                       searchString.get(), skipCount);
  });
});

Template.eventsCalendar.helpers({

  category: function() {
    var superCategories = R.pluck('superCategoryName',
                                  EventCategories.find().fetch());
    return R.uniq(superCategories.sort());
  }
});

Template.eventsCalendar.events({

  'keyup #search-box': _.throttle(function(e) {
    var text = $(e.target).val().trim();
    searchString.set(text);
  }, 200),

  'click .insertReservation': function(e) {
    e.preventDefault();

    thisId = this._id;
    var attributes = {
      eventId : thisId,
      numberOfPeople:  $('#select' + thisId).val()
    };

    Meteor.call('insertReservations', attributes, function(error) {
      if(error)
        addErrorMessage(error.reason);
    });
  },

  'click .removeReservation': function(e) {
    //make server side call to remove that reservation
    var eventId = this._id;

    Meteor.call('removeReservation', eventId, function(error) {
      if(error)
        addErrorMessage(error.reason);
    });
  },

  'click #back': function(e) {
    e.preventDefault();
    Router.go('manageEvents');
  },

  'click #clearBtn': function() {
    searchString.set('');
    $('#search-box').val('');
    $('#search-box').focus();
  },

  // This is a hack. I have invested too much time to start over, sorry.
  // Bootstrap enforces strict structure on their accordions that, when broken, cause strangeness
  // with collapsing other accordions during the opening of a new one
  // This just makes sure to collapse all other accordions when a new one is opened
  'click .panel-heading': function(e) {
    thisId = $(e.target).attr('aria-controls');
    if ( !($(e.target).attr('id') === thisId) )
      $('.panel-collapse.in').not(" [id='" + thisId + "'] ").collapse("hide");
  },

  'change #eventCategory': function(e) {
    Template.instance().superCategoryName.set($('#eventCategory').val());
  }
});

// eventPanel
Template.eventPanel.helpers({
  getEvents: function() {
    if (this.type === 'future') {
      return _.groupBy(Events.find({}, {sort: {eventDate: 1}}).fetch(), 
                       function(doc) {
                         return moment(doc.eventDate).format("MM/DD/YYYY");
      });
    } else {
      console.log("Error! Should always have future above");
    }
  },


  hasReservation: function() {
    return Reservations.findOne({
      userId: Meteor.userId(),
      eventId: this._id
    });
  },

  people: function() {
    return NumberOfPeople.find({}, {sort: {number: 1}});
  },

  hasMembers: function() {
    return !_.isEmpty(this);
  },

  isFuture: function(thisType) {
    return thisType.type === 'future';
  },

  prevPage: function() {
    var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
    return Router.routes.eventsCalendar.path({page: previousPage});
  },
  nextPage: function() {
    var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
    return Router.routes.eventsCalendar.path({page: nextPage});
  },
  prevPageClass: function() {
    return currentPage() <= 1 ? "disabled" : "";
  },
  nextPageClass: function() {
    return hasMorePages() ? "" : "disabled";
  }

});

Template.eventsCalendar.events({
  'click .calCheckIn': function() {
    Router.go('eventCheckinDetails', {id: this._id});
  },

  'click .panel-heading': function() {
    let eventsInSession = Session.get('calendarEventsCreated');

    if(!R.contains(this._id, eventsInSession)) {
      var myCalendar = createCalendar({
        options: {
          class: 'add-calendar-link',

          // You can pass an ID. If you don't, one will be generated for you
          id: 'addCal'+this._id
        },
        data: {
          // Event title
          title: this.name,

          // Event start date
          start: this.eventDate,

          // Event duration (IN MINUTES)
          duration: this.duration * 60, //duration is in hours on event doc

          // You can also choose to set an end time
          // If an end time is set, this will take precedence over duration
          //end: new Date('June 15, 2013 23:00'),     

          // Event Address
          address: this.address,

          // Event Description
          description: this.description
        }
      });

      document.querySelector("#calendar" + this._id).appendChild(
        myCalendar);

        Session.set('calendarEventsCreated', R.append(this._id,eventsInSession));
    }
  },
});

var hasMorePages = function() {
  var totalEvents = Counts.get('calendarCount');
  return currentPage() * parseInt(AppConfig.public.recordsPerPage) < totalEvents;
}

var currentPage = function() {
  return parseInt(Router.current().params.page) || 1;
}
