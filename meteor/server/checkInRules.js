
// Defines the check-in rules for an event
// Can be moved to /lib if we want to give some kind of feeback to users as well
// How it works:
// It follows the decision tree defined in CheckInRules.rules upon passing upon the invokation
// of validate()
// When debugging, log the path variable to see where the function is
// Should probably find a way to log the path variable on error
CheckInRules = {
	options: {
    // Max distance for ad hoc event in km
		maxAdHocDistance: 0.1,
    // Max distance for recognized event in km
		maxEventDistance: 0.1,
    // Values that should be allowed from decision tree endpoints
		allowedExitValues: ['auto','partner_admin','super_admin','not_allowed']
	},

	// Returns true if the user is trying to check in to a recognized event
	isRecognizedEvent: function(attributes) {
		var thisEvent = Events.findOne({ _id: attributes.eventId });
		return !!thisEvent;
	},

	// Returns 'true' if there is an event within maxAdHocDistance
	isRecognizedLocation: function(attributes) {
		var events = Events.find({ adHoc: false, deleteInd: false }).fetch();

		var closeEvent = _.find(events, function(oneEvent) {
			return HelperFunctions.haversineFormula(oneEvent, attributes.userLng, attributes.userLat) < CheckInRules.options.maxAdHocDistance;
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
    var distance = HelperFunctions.haversineFormula(event, attributes.userLng, attributes.userLat);

    // Check to see if it is in range
    if(distance <= CheckInRules.options.maxEventDistance) {
      return true;
    } else {
      return false;
    }
	},

  // Determines if the member is trying to check into a current event or a past event
  // The node should not be reached if there is no event, but check anyway
  isCurrentEvent: function(attributes) {
    var thisEvent = Events.findOne({ _id: attributes.eventId });

    if (thisEvent) {
      var thisEventMoment = moment(thisEvent.eventDate);
      var minStartDate = moment().add(AppConfig.checkIn.today.hoursBehind, 'h');
      var maxEndDate = moment().add(AppConfig.checkIn.today.hoursAhead, 'h');

      return thisEventMoment.isBetween(minStartDate, maxEndDate, 'second');
    } else {
      return 'NO_EVENT_FOUND';
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
      console.log('success ' + attributes.userId + ' ' + path + ' result:' + currentNode);
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
    // Current event
    name: 'isCurrentEvent',
    func: CheckInRules.isCurrentEvent,
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