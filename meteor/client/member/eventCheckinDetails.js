
var defaultHours = 3
hours = new ReactiveVar(defaultHours);

var checkinRules = {

}

var UserPhoto = {
	
	// True if the last photo attempted to be taken has failed
	takePhotoFailed: new ReactiveVar(false),
	
	// Local URI of a successful photo
	photoURI: new ReactiveVar(null),
	
	// Inserts the photo into the collection
	insert: function(callback) {

		var self = this;

		if (this.photoURI.get()) {
		  var newFile = new FS.File(this.photoURI.get());
		  var currentDate = new Date();
		  
		  newFile.metadata = {
		    userId: Meteor.userId(),
		    type: 'userEvent',
		    submissionTime: currentDate
		  };

		  var imageId = Images.insert(newFile, function(err, res) {
		  	!err && self.photoURI.set(null);
		  	callback(err,res);
		  })._id;
		  return imageId;
		} else {
			 callback && callback({ reason: 'There is no file URI' });
		}
	}, 

	// Removes a photo from the collection
	remove: function() {},

	// Uses mdg:camera to take a photo and store it locally
	takePhoto: function() {

		var self = this;
		MeteorCamera.getPicture({
    	quality: 30
    }, function(err, data) {

    	if (err) {

    		self.takePhotoFailed.set(true);
    		addErrorMessage(err.reason);

    	} else {

    		addSuccessMessage('Photo taken successfully');
    		self.takePhotoFailed.set(false);
    		self.photoURI.set(data);
    	}
    });
	}
}

var insetCheckin = function() {

}

var checkIn = function(id) {

	// var eventName = Session.get('eventName');
 //  var imageId = Session.get('imageId') || "";
 //  var eventDescription = $('#eventDescription').val();

  if( hours.get() > 0 ) {
  
  	UserPhoto.insert(function() {

		    var attributes = {
		      userId: Meteor.userId(),
		      imageId: fileObj._id,
		      eventId: this._id,
		      hoursSpent: hours.get()
		      // pendingEventName: eventName,
		      // pendingEventDescription: eventDescription,
		    };
		    
		    Meteor.call('insertTransaction', attributes, function(error) {
		      if(error) {
		        addErrorMessage(error.reason);
		        Router.go('submitNewEvent'); 
		      } else {
		        addSuccessMessage('Transaction successfully submitted');
		        Router.go('memberHomePage');
		      }
		    }); 
  	});

  } else {
    addErrorMessage('Please ensure that you are logging at least a half hour of time');
  }
};

Template.eventCheckinDetails.rendered = function() {

	UserPhoto.takePhotoFailed.set(false);
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

	'hasPhoto': function() {
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
    };
  },

  'click #addPhoto': function(e) {
    e.preventDefault();
    UserPhoto.takePhoto();
  },

  'click .check-in': function(e) {
    e.preventDefault();
    checkIn(this._id);
  },

  'click #photoPanel': function() {}

})