//TODO: this whole file needs to be refactored...
AutoForm.hooks({
  insertReservationsForm: {
    before: {
      insert: function(doc, template) {
        var rsvpEvent = Session.get('reservationModalDataContext');
        doc.userId = Meteor.userId();
        doc.eventId = rsvpEvent._id;
        doc.dateEntered = new Date();
        return doc;
      } 
    }
  }
});
var originalDataContext = "";

Template.listEvents.rendered = function() {
  originalDataContext = this.data;
  Session.set('eventType', this.data);
  Session.set('eventIndex', true);
  //TODO: remove magic number 7 below and make variable
  Session.set('eventsOffset', 7);
  Session.set('searchQuery', "");
  Session.set('institutionQuery', "");
  Session.set('categoryQuery', "");
  Session.set('showMap', false);
};

Template.listEvents.helpers({
  'rsvpButton': function(context) {
    var rsvpForEvent = Reservations.findOne({ userId: Meteor.userId(),
                                            eventId: this._id
    });
    if(rsvpForEvent) {
      return "<button type='button' class='btn btn-danger btn-sm removeReservation'>" + 
        "Remove RSVP</button>";
    } else {
      return "<button type='button' class='btn btn-default btn-sm insertReservation' " + 
        "data-toggle='modal' data-target = '#rsvpModal'>RSVP</button>";
    }
  },
  'showMapClicked': function() {
    return Session.get('showMap');
  },
  'eventModalContext': function() {
    return Session.get('eventModalDataContext');
  },
  'reservationModalContext': function() {
    return Session.get('reservationModalDataContext');
  },
  'editingDoc': function() {
    return Events.findOne(Session.get('eventModalDataContext')._id);
  },
  'isEventIndex': function() {
      return Session.get('eventIndex');
  },
  'eventView': function() {
      return Session.get('event');
  },
  'eventsToDisplay': function(){
    if(Session.equals('eventType', 'Current')) {
      var startEndDates = Events.calculateStartEndDates(Session.get('eventsOffset'));

      var startDate = startEndDates[0];
      var endDate = startEndDates[1];
      
      return Events.currentEvents(startDate, endDate);
    } else if (Session.equals('eventType', 'Upcoming')) {
      return Events.upcomingEvents();
    } else if (Session.equals('eventType', 'Searching')) {
      var keyword = Session.get("searchQuery");
      // TODO: Unit test this....
      var query = new RegExp( keyword, 'i' );
      var institution = Session.get('institutionQuery');
      var category = Session.get('categoryQuery');
      var currentDate = new Date();
      //TODO: I hate the below block of statements. At least
      //refactor the magic numbers out
      //only the search name box is filled in
      if(keyword !== "" && institution === "" && category === "") {
        console.log("query only");
        return Events.find({name: query, 
                           active: 1, 
                           endDate: {'$gte': currentDate}}, 
                           {limit: 10});
      } //only the institution is selected
      else if(keyword === "" && institution !== "" && category === ""){
        console.log("institution only");
        return Events.find({institution: institution,
                           active: 1, 
                           endDate: {'$gte': currentDate}}, 
                           {limit: 10});
      } //only the cateogry is selected
      else if(keyword === "" && institution === "" && category !== "") {
        console.log("category only");
        return Events.find({category: category,
                           active: 1, 
                           endDate: {'$gte': currentDate}}, 
                           {limit: 10});
      } //the search name and institution are selected
      else if(keyword !== "" && institution !== "" && category === "") {
        console.log("name and institution only");
        return Events.find({$and: [{name: query}, 
                                   {institution: institution}
                           ],
                           active: 1, 
                           endDate: {'$gte': currentDate}}, 
                           {limit: 10});
      } //the search name and category are selected 
      else if(keyword !== "" && institution === "" && category !== "") {
        console.log("name and category only");
        return Events.find({$and: [{name: query}, 
                                   {category: category}
                           ],
                           active: 1, 
                           endDate: {'$gte': currentDate}}, 
                           {limit: 10});
      } //the institution and category are selected
      else if(keyword === "" && institution !== "" && category !== "") {
        console.log("institution and category only");
        return Events.find({$and: [{institution: institution},
                                   {category: category}
                           ],
                           active: 1, 
                           endDate: {'$gte': currentDate}}, 
                           {limit: 10});
      } //the search name, instution, and category are all selected
      else if(keyword !== "" && institution !== "" && category !== "") {
        console.log("everything selected");
        return Events.find({$and: [{name: query}, 
                                   {institution: institution},
                                   {category: category}
                           ],
                           active: 1, 
                           endDate: {'$gte': currentDate}}, 
                           {limit: 10});
      } //this should never happen, throw an error
      else {
        throw new Meteor.Error(500, "Something went wrong with filtering...");
      }
    } else {
      return Events.allEvents();
    }
  },


  'title': function() {
    //this here is set by data context in iron-router (lib/router.js)
    if(Session.equals('eventType', 'Current')) {
      var startEndDates = Events.calculateStartEndDates(Session.get('eventsOffset'));
      var startDate = moment(startEndDates[0]).format('MMMM DD ');
      var endDate = moment(startEndDates[1]).format('MMMM DD YYYY');
      return startDate + " - " + endDate;
    } else if (Session.equals('eventType', 'Searching')) {
      return "Search Results";
    } else {
      return this + " Events";
    }
  },
  'pointType': function() {
    if(this.isPointsPerHour) {
      return "Points Per Hour";
    } else {
      return "Points";
    }
  },
  'pointsToDisplay': function() {
    if(this.isPointsPerHour) {
      return this.pointsPerHour;
    } else {
      return this.points;
    }
  },
  'displayNextLastWeekButtons': function() {
    if (Session.equals("eventType", "Current")) {
      return true;
    } else {
      return false;
    }
  },
  affiliatedInstitutions: function() {
    return institutions;
  },
  eventCategories: function() {
    return eventCategories;
  }
});

Template.listEvents.events({
  'click #submitRSVP': function(e) {
    $('#rsvpModal').modal('hide');
  },
  'click .editEvent': function(e) {
    Session.set('eventModalDataContext', this);
  },
  'click .insertReservation': function(e) {
    Session.set('reservationModalDataContext', this);
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
  'click .eventView': function(e) {
    Session.set('eventIndex', false);
    Session.set('event', this);
  },
  'click .checkIn': function(e) {
    e.preventDefault();
    Router.go('checkIntoEvent', {eventId: this._id});
  },
  'click .deleteEvent': function(e) {
    e.preventDefault();

    Meteor.call('deleteEvent', this._id, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Event successfully deleted");
      }
    });
  },
  'click #prevEvents': function(e) {
    e.preventDefault();

    Session.set('eventsOffset', Session.get('eventsOffset') - 7);
  },
  'click #nextEvents': function(e) {
    e.preventDefault();

    Session.set('eventsOffset', Session.get('eventsOffset') + 7);
  },
  'keyup #eventSearch': function(e) {
    Session.set("searchQuery", e.currentTarget.value);
    if(Session.equals("searchQuery","") && 
       $("#categories").val() === "" && 
       $("#institutions").val() === "") { 
      Session.set("eventType", originalDataContext);
    } else {
      Session.set("eventType", "Searching");
    }
  },
  'click #clearSearch': function(e) {
    e.preventDefault();

    $("#eventSearch").val("");
    $("#institutions").val("");
    $("#categories").val("");
    Session.set("eventType", originalDataContext);
    Session.set("searchQuery", "");
    Session.set("institutionQuery", "");
    Session.set("categoryQuery", "");
  },
  'change #institutions': function(e) {
    e.preventDefault();
    Session.set("institutionQuery",$("#institutions").val());
    if(Session.equals("searchQuery","") && 
       $("#categories").val() === "" && 
       $("#institutions").val() === "") {
      Session.set("eventType", originalDataContext);
    } else {
      Session.set("eventType","Searching");
    }
  },
  'change #categories': function(e) {
    e.preventDefault();
    Session.set("categoryQuery",$("#categories").val());
    if(Session.equals("searchQuery","") && 
       $("#categories").val() === "" && 
       $("#institutions").val() === "") {
      Session.set("eventType", originalDataContext);
    } else {
      Session.set("eventType","Searching");
    }
  },
  'click #showMap': function(e) {
    e.preventDefault();
    Session.set('showMap', true);
  },
  'click #hideMap': function(e) {
    e.preventDefault();
    Session.set('showMap', false);
  },
});
