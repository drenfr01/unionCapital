UI.registerHelper('formatDate', function(unformattedDate) {
    return moment(unformattedDate).format('MMMM DD hh:mm A');
});

UI.registerHelper('justTime', function(unformattedDate) {
    return moment(unformattedDate).format('hh:mm A');
});

UI.registerHelper("eventOptions", function() {
  return _.chain(Events.find().fetch())
          .map(function(event){
            return { label: event.name, value: event._id };
          }).value();
});
