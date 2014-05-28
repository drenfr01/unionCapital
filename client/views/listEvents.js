Template.listEvents.helpers({
  'events': function() {
    return Events.find({active: 1}, {sort: {startDate: 1}});
  },
  'formattedDate': function(unformattedDate) {
    return moment(unformattedDate).format('MMMM DD YYYY');
  }
});
