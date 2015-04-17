var defaultHours = 3;
var checkIn = {};

Template.eventCheckinDetails.created = function() {
	checkIn = new CheckIn(defaultHours);
};

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
	});
}

Template.eventCheckinDetails.helpers({

	'timeAttending': function() {
		return checkIn ? checkIn.hours.get() : defaultHours;
	},

	'hasPhoto': function() {
		return checkIn ? checkIn.getPhoto() : false;
	},

  checkingIn: function() {
    return checkIn ? checkIn.checkingIn.get() : false;
  },

  adHoc: function() {
  	return this._id === 'new';
  }
});

Template.eventCheckinDetails.events({

	'change #durationSlider': function() {
		checkIn.hours.set($('#durationSlider').val());
	},

  'click #addPhoto': function(e) {
    e.preventDefault();
    checkIn.takePhoto();
  },

  // Async, pass the checkin
  'click .check-in': function(e) {
    e.preventDefault();
    console.log(this);
    checkIn.submitCheckIn(this._id, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        Router.go('memberHomePage');
      }
    });
  },

  'click #back': function(e) {
  	e.preventDefault();
  	Router.go('checkin');
  },

  'click #photoPanel': function() {
    checkIn.removePhoto();
  }
});

Template.eventCheckinDetails.destroyed = function () {
	delete checkIn;
};
