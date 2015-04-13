//TODO: this is duplicate code from eventsCalendar
var options = {
  keepHistory: 1, //new events won't appear if this is set too long
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

Session.set('eventTypeSelected', "current");

Template.manageEvents.rendered = function() {
  $("#current").prop('checked', true);
  Session.set("category", $("#categories").val());
  Session.set("institution", $("#institutions").val());
  EventsSearch.search("");
};

Template.manageEvents.helpers({
  institutions: function() {
    var orgs = PartnerOrgs.find().fetch();
    orgs.push({name: 'All'});
    return _.sortBy(orgs, "name");
  },
  categories: function() {
    var eventCategories = EventCategories.find().fetch();
    eventCategories.push({name: 'All'});
    return _.sortBy(eventCategories, "name");
  },
  events: function() {
    if(Session.equals('eventTypeSelected', "past")) {
      return Events.pastEvents(Session.get("institution"),
                              Session.get("category"));
    } else if (Session.equals('eventTypeSelected', "current")){
      return Events.currentEvents(Session.get("institution"),
                                 Session.get("category"));
    } else { //user is using search bar
      var events = getEventsData();
      var eventsByDate = _.groupBy(events, function(event) {
        return moment(event.eventDate).format("YYYY MM DD");
      });
      return eventsByDate;
    }
  },
  eventTypeSelected: function(eventType) {
    return Session.equals("eventTypeSelected", eventType);
  }
});

Template.manageEvents.events({
  'change .radio-inline': function(e) {
    Session.set('eventTypeSelected', e.target.value);
    $("#search-box").val("");
  },
  'change #institutions': function(e) {
    Session.set("institution", $("#institutions").val());
  },
  'change #categories': function(e) {
    Session.set("category", $("#categories").val());
  },
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    if(text) {
      Session.set("eventTypeSelected", "searching");
      EventsSearch.search(text);
    } else {
      Session.set("eventTypeSelected", "current");
      $("#current").prop('checked', true);
    }
  }, 200),
  'click .editEvent': function(e) {
    e.preventDefault();
    if(Roles.userIsInRole(Meteor.userId(), ['admin']) || 
       Meteor.user().profile.partnerOrg === this.institution) {
      Router.go('editEvent', {_id: this._id});
    } else {
      console.log('Permission Denied: You do not own this event');
      addErrorMessage('Permission Denied: You do not own this event');
    }
  },
  'click .deleteEvent': function(e) {
    if(Roles.userIsInRole(Meteor.userId(), ['admin']) || 
       Meteor.user().profile.partnerOrg === this.institution) {
      Meteor.call('deleteEvent', this._id, function(error) {
        if(error) {
          addErrorMessage(error.reason);
        }
      });
    } else {
      addErrorMessage('Permission Denied: You do not own this event');
    }
  },
  'click #addEvent': function(e) {
    e.preventDefault();
    Router.go('addEvents');
  }
});
