
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
		return true;
	},

	hasPhoto: function(attributes) {
		return Images.findOne({ _id: attributes.imageId });
	},

	geolocSuccess: function() {
		return true;
	},

	// Changes the attributes.needsApproval to false if it meets the criteris laid out below
	validate_old: function(attributes) {
		if (checkInRules.isRecognizedEvent(attributes))
			attributes.needsApproval = false;
		else if (checkInRules.isRecognizedLocation(attributes) && checkInRules.hasPhoto(attributes))
			attributes.needsApproval = false;
		else
			attributes.needsApproval = true;
	},

	// TODO: Determine whether we are going to return a value or alter the attributes
	validate: function(attributes) {
		try
		{
			var currentNode = checkInRules.decisionTree;
			return followTree();
		}
		catch
		{
			addErrorMessage('Check-In Failed');
		}
	},

	followTree = function() {
		var result = currentNode.func();

		if (result === true) {

			currentNode = currentNode.isTrue;
			followTree();

		} else if (result === false) {

			currentNode = currentNode.isFalse;
			followTree();

		} else if (_.indexOf(checkInRules.options.allowedExitValues, result) !== -1) {

			return result;

		} else {

			Throw New Error('UNEXPECTED_OUTPUT');

		}
	}

	decisionTree: {
		func: checkInRules.isRecognizedEvent,
		isTrue: {
			func: checkInRules.geolocSuccess,
			isTrue: {
				func: inRange,
				isTrue: {
					func: checkInRules.hasPhoto,
					isTrue: 'auto',
					isFalse: 'auto'
				},
				isFalse: {
					func: checkInRules.hasPhoto,
					isTrue: 'auto',
					isFalse: 'auto'
				}
			},
			isFalse: {
				func: checkInRules.hasPhoto,
				isTrue: 'partner_admin',
				isFalse: 'partner_admin'
			}
		},
		isFalse: {
			func: checkInRules.geolocSuccess,
			isTrue: {
				func: checkInRules.isRecognizedLocation,
				isTrue: {
					func:  checkInRules.hasPhoto,
					isTrue: 'partner_admin',
					isFalse: 'partner_admin'
				},
				isFalse: {
					func: checkInRules.hasPhoto,
					isTrue: 'super_admin',
					isFalse: 'not_allowed'
				}
			},
			isFalse: {
				func: checkInRules.hasPhoto,
				isTrue: 'super_admin',
				isFalse: 'not_allowed'
			}
		}
	}
}


// Next move: finish putting this into an object
// Add isRecognizedLocation logic
// Add geoloc success object