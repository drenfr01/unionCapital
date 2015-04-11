
// Defines the check-in rules for an event
// Can be moved to /lib if we want to give some kind of feeback to users as well
CheckInRules = function(attributes) {
	this.options = {
		maxAdHocDistance: 100,
		maxEventDistance: 100,
		allowedExitValues: ['auto','partner_admin','super_admin','not_allowed']
	};

	this.attributes = attributes;
};

_.extend(CheckInRules.prototype, {

	isRecognizedEvent: function() {
		return Events.findOne({ _id: this.attributes.eventId });
	},

	isRecognizedLocation: function() {
		// TODO: Add logic here once the collection has been created

		Events.findOne({  })

		return true;
	},

	hasPhoto: function() {
		return Images.findOne({ _id: this.attributes.imageId });
	},

	geolocSuccess: function() {
		if (this.attributes.userLat && this.attributes.userLng)
			return true;
		else
			return false;
	},

	inRange: function() {

		// Verify that the user has not already checked in
		var event = Events.findOne(this.attributes.eventId);
    if(Transactions.findOne({userId: this.attributes.userId, eventId: event._id})) {
      throw new Meteor.Error(400, "You have already checked into this event");
    }

    // Calculate the distance between the user and the event
    var distance = helperFunctions.haversineFormula(event, this.attributes.userLng, this.attributes.userLat);

    // Check to see if it is in range
    //TODO: consider adding user geolocation info to transaction?
    if(distance <= this.options.maxEventDistance) {
      return true;
    } else {
      return false;
    }
	},

	// TODO: Determine whether we are going to return a value or alter the attributes
	validate: function() {

		var self = this;

	  try {
	    var currentNode = self.rules;
	    return self.followTree(self.rules);
	  } catch (e) {
	    addErrorMessage('Check-In Failed');
	    return 'failed';
	  }
	},

	followTree: function(currentNode) {

		var self = this;

	  // If there is a function to call, we are not yet at and endpoint node
	  if (currentNode.func) {
	    var result = currentNode.func();

	    // Follow the 'true' node of the tree
	    if (result === true) {
	      currentNode = currentNode.isTrue;
	      return self.followTree(currentNode);

	    // Follow the 'false' node of the tree
	    } else if (result === false) {
	      currentNode = currentNode.isFalse;
	      return self.followTree(currentNode);
	    }

	  // Check if the current node is an allowed exit value
	  } else if (_.indexOf(self.options.allowedExitValues, currentNode) > -1) {
	    return currentNode;

	  // If it isn't a node or an exit value, something is wrong
	  } else {
	    throw new Exception('UNEXPECTED_OUTPUT');
	  }
	},

	rules: {
	  // Recognized event
	  func: this.isRecognizedEvent,
	  isTrue: {
	    // Geolocation works
	    func: this.geolocSuccess,
	    isTrue: {
	      // Is in range of the event
	      func: this.inRange,
	      isTrue: {
	        // Has a photo
	        func: this.hasPhoto,
	        isTrue: 'auto',
	        isFalse: 'auto'
	      },
	      isFalse: {
	        // Has a photo
	        func: this.hasPhoto,
	        isTrue: 'auto',
	        isFalse: 'auto'
	      }
	    },
	    isFalse: {
	      // Has a photo
	      func: this.hasPhoto,
	      isTrue: 'partner_admin',
	      isFalse: 'partner_admin'
	    }
	  },
	  isFalse: {
	    // Geolocation works
	    func: this.geolocSuccess,
	    isTrue: {
	      // Is a recognized location
	      func: this.isRecognizedLocation,
	      isTrue: {
	        // Has a photo
	        func:  this.hasPhoto,
	        isTrue: 'partner_admin',
	        isFalse: 'partner_admin'
	      },
	      isFalse: {
	        // Has a photo
	        func: this.hasPhoto,
	        isTrue: 'super_admin',
	        isFalse: 'not_allowed'
	      }
	    },
	    isFalse: {
	      // Has a photo
	      func: this.hasPhoto,
	      isTrue: 'super_admin',
	      isFalse: 'not_allowed'
	    }
	  }
	}
});

// Changes the attributes.needsApproval to false if it meets the criteris laid out below
  // validate_old: function(attributes) {
  //   if (checkInRules.isRecognizedEvent(attributes))
  //     attributes.needsApproval = false;
  //   else if (checkInRules.isRecognizedLocation(attributes) && checkInRules.hasPhoto(attributes))
  //     attributes.needsApproval = false;
  //   else
  //     attributes.needsApproval = true;
  // }



// Next move: finish putting this into an object
// Add isRecognizedLocation logic
// Add geoloc success object