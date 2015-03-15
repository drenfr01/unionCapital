
// Defines the check-in rules for an event
// Created to run on both server and client for validation
checkInRules = {

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

	// Changes the attributes.needApproval to false if it meets the criteris laid out below
	validate: function(attributes) {
		if (checkInRules.isRecognizedEvent(attributes))
			attributes.needsApproval = false;
		else if (checkInRules.isRecognizedLocation(attributes) && checkInRules.hasPhoto(attributes))
			attributes.needsApproval = false;
		else
			attributes.needsApproval = true;
	}
}
