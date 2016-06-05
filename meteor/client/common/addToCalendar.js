Template.addToCalendar.onRendered(function() {
  //TODO:
  //GoogleCalendar.checkAuth();
});

Template.addToCalendar.events({
  'click .addToCalendar': function(e) {
    console.log('testing');
    var myCalendar = createCalendar({
      options: {
	class: 'my-class',

	// You can pass an ID. If you don't, one will be generated for you
	id: 'my-id'
      },
      data: {
	// Event title
	title: 'Get on the front page of HN',

	// Event start date
	start: new Date('June 15, 2013 19:00'),

	// Event duration (IN MINUTES)
	duration: 120,

	// You can also choose to set an end time
	// If an end time is set, this will take precedence over duration
	end: new Date('June 15, 2013 23:00'),     

	// Event Address
	address: 'The internet',

	// Event Description
	description: 'Get on the front page of HN, then prepare for world domination.'
      }
    });

    document.querySelector('.eventTime').appendChild(
      myCalendar);
  },

});

