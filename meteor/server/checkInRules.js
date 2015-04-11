
// Defines the check-in rules for an event
// Can be moved to /lib if we want to give some kind of feeback to users as well
checkInRules = {

	options: {
		maxAdHocDistance: 100,
		maxEventDistance: 100,
		allowedExitValues: ['auto','partner_admin','super_admin','not_allowed']
	},

	isRecognizedEvent: function(attributes) {
		return Events.findOne({ _id: attributes.eventId });
	},

	isRecognizedLocation: function(attributes) {
		// TODO: Add logic here once the collection has been created

		Events.findOne({ })

		return true;
	},

	hasPhoto: function(attributes) {
		return Images.findOne({ _id: attributes.imageId });
	},

	geolocSuccess: function() {
		return true;
	},

	inRange: function() {
		return false;
	}
};

// TODO: Determine whether we are going to return a value or alter the attributes
checkInRules.validate = function(attributes) {
  try {
    var currentNode = checkInRules.rules;
    return checkInRules.followTree(checkInRules.rules);
  } catch (e) {
    addErrorMessage('Check-In Failed');
    return 'failed';
  }
};

checkInRules.followTree = function(currentNode) {

  // If there is a function to call, we are not yet at and endpoint node
  if (currentNode.func) {
    var result = currentNode.func();

    // Follow the true node of the tree
    if (result === true) {
      currentNode = currentNode.isTrue;
      return checkInRules.followTree(currentNode);

    // Follow the 'false' node of the tree
    } else if (result === false) {
      currentNode = currentNode.isFalse;
      return checkInRules.followTree(currentNode);
    }

  // Check if the current node is an allowed exit value
  } else if (_.indexOf(checkInRules.options.allowedExitValues, currentNode) !== -1) {
    return currentNode;

  // If it isn't a node or an exit value, something is wrong
  } else {
    throw new Exception('UNEXPECTED_OUTPUT');
  }
};

checkInRules.rules = {
  // Recognized event
  func: checkInRules.isRecognizedEvent,
  isTrue: {
    // Geolocation works
    func: checkInRules.geolocSuccess,
    isTrue: {
      // Is in range of the event
      func: checkInRules.inRange,
      isTrue: {
        // Has a photo
        func: checkInRules.hasPhoto,
        isTrue: 'auto',
        isFalse: 'auto'
      },
      isFalse: {
        // Has a photo
        func: checkInRules.hasPhoto,
        isTrue: 'auto',
        isFalse: 'auto'
      }
    },
    isFalse: {
      // Has a photo
      func: checkInRules.hasPhoto,
      isTrue: 'partner_admin',
      isFalse: 'partner_admin'
    }
  },
  isFalse: {
    // Geolocation works
    func: checkInRules.geolocSuccess,
    isTrue: {
      // Is a recognized location
      func: checkInRules.isRecognizedLocation,
      isTrue: {
        // Has a photo
        func:  checkInRules.hasPhoto,
        isTrue: 'partner_admin',
        isFalse: 'partner_admin'
      },
      isFalse: {
        // Has a photo
        func: checkInRules.hasPhoto,
        isTrue: 'super_admin',
        isFalse: 'not_allowed'
      }
    },
    isFalse: {
      // Has a photo
      func: checkInRules.hasPhoto,
      isTrue: 'super_admin',
      isFalse: 'not_allowed'
    }
  }
}

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