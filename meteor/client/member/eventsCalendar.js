var options = {
  keepHistory: 1,
  localSearch: false
};

var fields = ['name', 'description'];

EventsSearch = new SearchSource('eventsSearch', fields, options);

var getEventsData = function() {
  return EventsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<span style='color:red'>$&</span>");
    },
    sort: {eventDate: 1}
  });
};

Template.eventsCalendar.rendered = function() {
  EventsSearch.search("");
};

Template.eventsCalendar.helpers({
  getEvents: function() {
    var events = getEventsData();
    //Note: we could filter server side, but it seemed more flexible
    //to push all data to the client then let it handle filtering
    //We could have a "include past events" flag for the user
    var currentEvents = _.filter(events, function(event) {
      var eventDate = event.eventDate.setHours(0,0,0,0);
      var currentDate = new Date().setHours(0,0,0,0);
      return eventDate >= currentDate;
    });
    var eventsByDate = _.groupBy(currentEvents, function(event) {
      return moment(event.eventDate).format("MM/DD/YYYY");
    });
    return eventsByDate;
  },
  hasReservation: function() {
    return Reservations.findOne({ userId: Meteor.userId(),
                                            eventId: this._id});
  },
  people: function() {
    return NumberOfPeople.find();
  }
});

Template.eventsCalendar.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    EventsSearch.search(text);
  }, 200),
  'click .insertReservation': function(e) {
    e.preventDefault();
    var attributes = {
      userId : Meteor.userId(),
      eventId : this._id,
      dateEntered : new Date(),
      numberOfPeople: $(e.target).closest('div').find('.numberOfPeople').val()
    };

    Meteor.call('insertReservations', attributes, function(error) {
      if(error) {
        console.log(error.reason);
      }
    });
  },
  'click .removeReservation': function(e) {
    //make server side call to remove that reservation
    var attributes = {
      userId: Meteor.userId(),
      eventId: this._id
    };
    Meteor.call('removeReservation', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Your reservation has been removed");
      }
    });
  },
  'click #back': function(e) {
    e.preventDefault();
    Router.go('manageEvents');
  }
});
