
var defaultHours = 3
hours = new ReactiveVar(defaultHours);

var checkIn = function(eventId) {

  if( userPhoto.photoURI.get() ) {
    userPhoto.insert(function(err, fileObj) {
      if ( err ) {
        addErrorMessage(err.reason);
      } else {
        console.log(fileObj._id);
        insertTransaction(eventId, fileObj._id);
      }
    });
  } else {
    insertTransaction(eventId, null);
  }
};

var insertTransaction = function(eventId, imageId) {
  var attributes = {
    userId: Meteor.userId(),
    eventId: eventId,
    hoursSpent: hours.get()
    // pendingEventName: eventName,
    // pendingEventDescription: eventDescription,
  };

  // Instead of just passing a null imageId field, this omits the field
  // entirely to stay consistent with the check() function called on the server
  if( imageId )
    attributes.imageId = imageId;

  Meteor.call('insertTransaction', attributes, function(error) {
    if(error) {
      addErrorMessage(error.reason);
      Router.go('submitNewEvent'); 
    } else {
      addSuccessMessage('Transaction successfully submitted');
      Router.go('memberHomePage');
    }
  });
};

Template.eventCheckinDetails.created = function() {
	userPhoto = new UserPhoto();
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
		return hours.get();
	},

	'hasPhoto': function() {
		return userPhoto.photoURI.get();
	}
})

Template.eventCheckinDetails.events({
	
	'change #durationSlider': function() {
		hours.set($('#durationSlider').val());
	},

	'click #submit': function(e) {
    e.preventDefault();

    var attributes = {
      userId: Meteor.userId(),
      eventId: this._id,
      
      // hoursSpent: parseInt($('#hours').val(),10),
    };
  },

  'click #addPhoto': function(e) {
    e.preventDefault();
    userPhoto.takePhoto();
  },

  'click .check-in': function(e) {
    e.preventDefault();
    
    var attributes = {
      userId: Meteor.userId(),
      imageId: 1,
      eventId: this._id,
      hoursSpent: hours.get()
      // pendingEventName: eventName,
      // pendingEventDescription: eventDescription,
    };

    checkIn(this._id);
  },

  'click #photoPanel': function() {}

});

Template.eventCheckinDetails.destroyed = function () {
	delete userPhoto;
};