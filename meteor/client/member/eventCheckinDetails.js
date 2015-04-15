
var defaultHours = 3
hours = new ReactiveVar(defaultHours);

function checkIn(eventId) {

  if( userPhoto.photoURI.get() ) {
    userPhoto.insert(function(err, fileObj) {
      if ( err ) {
        addErrorMessage(err.reason);
      } else {
        insertTransaction(eventId, fileObj._id);
      }
    });
  } else {
    insertTransaction(eventId, null);
  }
};

// Sets the attributes prior to calling the insert function
function insertTransaction(eventId, imageId) {
  var attributes = {
    userId: Meteor.userId(),
    eventId: eventId,
    hoursSpent: parseInt(hours.get())
    // pendingEventName: eventName,
    // pendingEventDescription: eventDescription,
  };

  // Instead of just passing a null imageId field, this omits the field
  // entirely to stay consistent with the check() function called on the server
  if( imageId )
    attributes.imageId = imageId;

  // If lat or lng is null, then try to get it one more time
  // Useful if the user accessed this page from a link or bookmark
  if (gmaps.currentLocation.lat && gmaps.currentLocation.lng) {
    attributes.userLat = gmaps.currentLocation.lat;
    attributes.userLng = gmaps.currentLocation.lng;
    callInsert(attributes);
  } else {
    gmaps.getCurrentLocation(function(error, currentLocation) {

      if (!error) {
        attributes.userLat = currentLocation.lat;
        attributes.userLng = currentLocation.lng;
      }

      callInsert(attributes);
    });
  }
};

// Calls insertTransaction and routes the user
function callInsert(attributes) {
  Meteor.call('insertTransaction', attributes, function(error) {
    if(error) {
      addErrorMessage(error.reason);
    } else {
      Router.go('memberHomePage');
    }
  });

  Session.set('checkingIn', false);
};

Template.eventCheckinDetails.created = function() {
	userPhoto = new UserPhoto();
};

Template.eventCheckinDetails.rendered = function() {

  Session.set('checkingIn', false);

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
	},

  checkingIn: function() {
    return Session.get('checkingIn');
  }
});

Template.eventCheckinDetails.events({

	'change #durationSlider': function() {
		hours.set($('#durationSlider').val());
	},

  'click #addPhoto': function(e) {
    e.preventDefault();
    userPhoto.takePhoto();
  },

  'click .check-in': function(e) {
    e.preventDefault();

    var attributes = {
      imageId: 1,
      eventId: this._id,
      hoursSpent: parseInt(hours.get())
      // pendingEventName: eventName,
      // pendingEventDescription: eventDescription,
    };

    Session.set('checkingIn', true);
    checkIn(this._id);
  },

  'click #back': function(e) {
  	e.preventDefault();
  	Router.go('checkin');
  },

  'click #photoPanel': function() {
    userPhoto.remove();
  }

});

Template.eventCheckinDetails.destroyed = function () {
	delete userPhoto;
};
