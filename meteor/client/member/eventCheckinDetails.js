
var defaultHours = 3
hours = new ReactiveVar(defaultHours);

var UserPhoto = {
	
	// Represents that the last photo attempted to be taken has failed
	takePhotoFail: new ReactiveVar(false),
	
	// Local URI of a successful photo
	photoURI: new ReactiveVar(null),
	
	// Inserts the photo into the collection
	insert: function(uri, callback) {
	  var newFile = new FS.File(file);
	  var currentDate = new Date();
	  
	  newFile.metadata = {
	    userId: Meteor.userId(),
	    type: 'userEvent',
	    submissionTime: currentDate
	  };

	  var imageId = Images.insert(newFile, callback)._id;
	  return imageId;
	}, 

	// Removes a photo from the collection
	remove: function() {},

	// Uses mdg:camera to take a photo and store it locally
	takePhoto: function() {
		MeteorCamera.getPicture({
    	quality: 50
    }, function(err, data) {

    	if (err) {
    		UserPhoto.takePhotoFail.set(true);
    		addErrorMessage(err.reason);
    	} else {
    		addSuccessMessage('Photo taken successfully');
    		UserPhoto.photoURI.set(data);
    	}
    });
	}
}

Template.eventCheckinDetails.rendered = function() {

	UserPhoto.takePhotoFail.set(false);
	UserPhoto.photoURI.set(null);

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

	'photoPreview': function() {
		return UserPhoto.photoURI.get();
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
      // minutesSpent: parseInt($('#minutes').val(),10),
    };
  },

  'click #addPhoto': function(e) {
    e.preventDefault();
    UserPhoto.takePhoto();
  },

})