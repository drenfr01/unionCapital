
var defaultHours = 3
hours = new ReactiveVar(defaultHours);

Template.eventCheckinDetails.rendered = function() {
	$('#durationSlider').noUiSlider({
		start: [defaultHours],
		range: {
			min: [0],
			max: [8]
		},
		step: 0.5,
		format: wNumb({
			decimals: 1
		})
	});

	$('#durationSlider').noUiSlider_pips({
		mode: 'values',
		values: [0,1,2,3,4,5,6,7,8]
		// filter: function(value, type) {
		// 	return value%1 ? 1 : 0;
		// }
	});
}

Template.eventCheckinDetails.helpers({

	'timeAttending': function() {
		return hours.get();
	}
})

Template.eventCheckinDetails.events({
	'change #durationSlider': function() {
		hours.set($('#durationSlider').val());
	}
})