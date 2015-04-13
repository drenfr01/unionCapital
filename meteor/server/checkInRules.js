
// Defines the check-in rules for an event
// Can be moved to /lib if we want to give some kind of feeback to users as well
// How it works:
// It follows the decision tree defined in CheckInRules.rules upon passing upon the invokation
// of validate()
// When debugging, log the path variable to see where the function is
// Should probably find a way to log the path variable on error
CheckInRules = {
	options: {
		maxAdHocDistance: 100,
		maxEventDistance: 100,
		allowedExitValues: ['auto','partner_admin','super_admin','not_allowed']
	},

	// Returns true if the user is trying to check in to a recognized event
	isRecognizedEvent: function(attributes) {
		var event = Events.findOne({ _id: attributes.eventId });
		return !!event;
	},

	// Returns 'true' if there is an event within maxAdHocDistance
	isRecognizedLocation: function(attributes) {
		// TODO: Add logic here once the collection has been created
		var events = Events.find({ adHoc: false }).fetch();

		var closeEvent = _.find(events, function() {
			return helperFunctions.haversineFormula(event, attributes.userLng, attributes.userLat) < maxAdHocDistance;
		});

		return !!closeEvent;
	},

	// Returns true if the user has a photo
	hasPhoto: function(attributes) {
		var img = Images.findOne({ _id: attributes.imageId });

		return !!img;
	},

	// Returns true if the user's geolocation is functioning
	geolocSuccess: function(attributes) {
		if (attributes.userLat && attributes.userLng)
			return true;
		else
			return false;
	},

	// Returns true if the user is within maxEventDistance of the event
	inRange: function(attributes) {

		// Verify that the user has not already checked in
		var event = Events.findOne(attributes.eventId);
    if(Transactions.findOne({userId: attributes.userId, eventId: event._id})) {
      throw new Meteor.Error(400, "You have already checked into this event");
    }

    // Calculate the distance between the user and the event
    var distance = helperFunctions.haversineFormula(event, attributes.userLng, attributes.userLat);

    // Check to see if it is in range
    //TODO: consider adding user geolocation info to transaction?
    if(distance <= CheckInRules.options.maxEventDistance) {
      return true;
    } else {
      return false;
    }
	},

	// TODO: Determine whether we are going to return a value or alter the attributes
	validate: function(attributes) {



    var currentNode = CheckInRules.rules;
    var path = 'start';
    return CheckInRules.followTree(currentNode, attributes, path);
	},

	followTree: function(currentNode, attributes, path) {

	  // If there is a function to call, we are not yet at and endpoint node
	  if (currentNode.func) {

	    var result = currentNode.func(attributes);
	    path = path + '/' + currentNode.name;

	    // Follow the 'true' node of the tree
	    if (result === true) {
	      currentNode = currentNode.isTrue;
	      path = path + '[true]';
	      return CheckInRules.followTree(currentNode, attributes, path);

	    // Follow the 'false' node of the tree
	    } else if (result === false) {
	      currentNode = currentNode.isFalse;
	      path = path + '[false]';
	      return CheckInRules.followTree(currentNode, attributes, path);
	    }

	  // Check if the current node is an allowed exit value
	  } else if (_.indexOf(CheckInRules.options.allowedExitValues, currentNode) > -1) {
      console.log('success ' + attributes.userId + ' ' + path);
	    return currentNode;

	  // If it isn't a node or an exit value, something is wrong
	  } else {
      console.log('failure' + attributes.userId + ' ' + path);
	    throw new Meteor.Error('UNEXPECTED_OUTPUT', path);
	  }
	}
};

CheckInRules.rules = {
  // Recognized event
  name: 'isRecognizedEvent',
  func: CheckInRules.isRecognizedEvent,
  isTrue: {
    // Geolocation works
    name: 'geolocSuccess',
    func: CheckInRules.geolocSuccess,
    isTrue: {
      // Is in range of the event
      name: 'inRange',
      func: CheckInRules.inRange,
      isTrue: {
        // Has a photo
        name: 'hasPhoto',
        func: CheckInRules.hasPhoto,
        isTrue: 'auto',
        isFalse: 'auto'
      },
      isFalse: {
        // Has a photo
        name: 'hasPhoto',
        func: CheckInRules.hasPhoto,
        isTrue: 'partner_admin',
        isFalse: 'partner_admin'
      }
    },
    isFalse: {
      // Has a photo
      name: 'hasPhoto',
      func: CheckInRules.hasPhoto,
      isTrue: 'partner_admin',
      isFalse: 'partner_admin'
    }
  },
  isFalse: {
    // Geolocation works
    name: 'geolocSuccess',
    func: CheckInRules.geolocSuccess,
    isTrue: {
      // Is a recognized location
      name: 'isRecognizedLocation',
      func: CheckInRules.isRecognizedLocation,
      isTrue: {
        // Has a photo
        name: 'hasPhoto',
        func:  CheckInRules.hasPhoto,
        isTrue: 'partner_admin',
        isFalse: 'partner_admin'
      },
      isFalse: {
        // Has a photo
        name: 'hasPhoto',
        func: CheckInRules.hasPhoto,
        isTrue: 'super_admin',
        isFalse: 'not_allowed'
      }
    },
    isFalse: {
      // Has a photo
      name: 'hasPhoto',
      func: CheckInRules.hasPhoto,
      isTrue: 'super_admin',
      isFalse: 'not_allowed'
    }
  }
};