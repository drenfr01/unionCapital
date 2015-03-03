UI.registerHelper('formatDate', function(unformattedDate) {
    if(moment(unformattedDate).isValid()) {
      return moment(unformattedDate).format('MMMM DD hh:mm A');
    } else {
      return "";
    }
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

//handlebars supports iterating over object keys, but 
//Meteor currently does not. This gives Meteor this ability
UI.registerHelper("arrayify", function(obj) {
  result = [];
  for (var key in obj) {
    result.push({name: key, value: obj[key]});
  }
  return result;
});
