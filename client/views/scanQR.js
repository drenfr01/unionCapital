UI.registerHelper("activityOptions", function() {
  //TODO: create label and value property
  var events = Events.find().fetch();
  var names =  _.pluck(events, 'name');
  var options = [];
  _.each(names, function(name) {
    options.push({label: name, value: name});
  });
  return options;
});

Template.scanQR.events({
  'submit': function(e) {
    console.log('click');
  }
});
