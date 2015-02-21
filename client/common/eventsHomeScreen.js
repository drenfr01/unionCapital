//Correct Timezone support
Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});

Template.eventsHomeScreen.rendered = function(){
  $('#eventDate').val(new Date().toDateInputValue()); 
  Session.set("eventDate", $("#eventDate").val());
};

Template.eventsHomeScreen.helpers({
  eventsToDisplay: function() {
    var selectedDate = Session.get("eventDate");
    var startDate = moment(selectedDate).hours(0).minutes(0).seconds(0).toDate();
    var endDate = moment(selectedDate).hours(23).minutes(59).seconds(59).toDate();
    return Events.currentEvents(startDate, endDate);
  }
});

Template.eventsHomeScreen.events({
  "change #eventDate": function() {
    Session.set('eventDate', $('#eventDate').val());
  }
  
});
