
// Defines the check-in rules for an event
// It follows the decision tree defined in setTree when run() is called
// When debugging, log the path variable to see where the function is by passing 1
// in the constructor instead of 0

var options = {
  // Max distance for ad hoc event in km
  maxAdHocDistance: 0.1,
  // Max distance for recognized event in km
  maxEventDistance: 0.1,
};

CheckInRules = new DecisionTree(1);

CheckInRules.setTree({
  func: 'isRecognizedEvent',
  isTrue: {
    func: 'isCurrentEvent',
    isTrue: {
      func: 'geolocSuccess',
      isTrue: {
        func: 'inRange',
        isTrue: {
          func: 'hasPhoto',
          isTrue: 'auto',
          isFalse: 'auto'
        },
        isFalse: {
          func: 'hasPhoto',
          isTrue: 'partner_admin',
          isFalse: 'partner_admin'
        }
      },
      isFalse: {
        func: 'hasPhoto',
        isTrue: 'partner_admin',
        isFalse: 'partner_admin'
      }
    },
    isFalse: {
      func: 'hasPhoto',
      isTrue: 'partner_admin',
      isFalse: 'partner_admin'
    }
  },
  isFalse: {
    func: 'geolocSuccess',
    isTrue: {
      func: 'isRecognizedLocation',
      isTrue: {
        func: 'hasPhoto',
        isTrue: 'partner_admin',
        isFalse: 'partner_admin'
      },
      isFalse: {
        func: 'hasPhoto',
        isTrue: 'super_admin',
        isFalse: 'not_allowed'
      }
    },
    isFalse: {
      func: 'hasPhoto',
      isTrue: 'super_admin',
      isFalse: 'not_allowed'
    }
  }
});

CheckInRules.setFunctions({
  // Returns true if the user is trying to check in to a recognized event
  isRecognizedEvent: function(attributes) {
    var thisEvent = Events.findOne({ _id: attributes.eventId });
    return !!thisEvent;
  },

  // Returns 'true' if there is an event within maxAdHocDistance
  isRecognizedLocation: function(attributes) {
    var events = Events.find({ adHoc: false, deleteInd: false }).fetch();

    var closeEvent = _.find(events, function(oneEvent) {
      return HelperFunctions.haversineFormula(oneEvent, attributes.userLng, attributes.userLat) < options.maxAdHocDistance;
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
    if(distance <= options.maxEventDistance) {
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
  }
});
