
CheckIn = function(defaultHours) {
  var self = this;

  self.hours = new ReactiveVar(defaultHours);
  self.checkingIn = new ReactiveVar(false);
  self.userPhoto = new UserPhoto();
  self.attributes = {};
  self.pendingEventName = null;
  self.pendingEventDescription = null;

  // Calls insertTransaction and routes the user
  // Private function
  function callInsert(callback) {
    Meteor.call( 'insertTransaction', self.attributes, callback );
  }

  // Sets the attributes prior to calling the insert function
  // Semiprivate function - should not be called directly
  self.insertTransaction = function(eventId, imageId, callback) {

    var parsedHours = parseInt(self.hours.get());

    self.attributes = {
      userId: Meteor.userId(),
      hoursSpent: parsedHours ? parsedHours : 0
    };

    // If new, then don't set the eventId to avoid check() errors
    if (eventId === 'new' && self.attributes.pendingEventName && self.attributes.endingEventDescription) {
      self.attributes.pendingEventName = self.pendingEventName;
      self.attributes.endingEventDescription = self.pendingEventDescription;
    } else if (eventId) {
      // Else set the event ID
      self.attributes.eventId = eventId;
    } else {
      // This case should not happen, so let's throw an error
      callback('NO_EVENT_NAME', null);
      throw new Meteor.Error('NO_EVENT_NAME');
    }

    // Instead of just passing a null imageId field, this omits the field
    // entirely to stay consistent with the check() function called on the server
    if( imageId )
      self.attributes.imageId = imageId;

    // If lat or lng is null, then try to get it one more time
    // Useful if the user accessed this page from a link or bookmark
    if (gmaps.currentLocation.lat && gmaps.currentLocation.lng) {

      self.attributes.userLat = gmaps.currentLocation.lat;
      self.attributes.userLng = gmaps.currentLocation.lng;
      callInsert(callback);

    } else {

      gmaps.getCurrentLocation(function(error, currentLocation) {

        if (!error) {
          self.attributes.userLat = currentLocation.lat;
          self.attributes.userLng = currentLocation.lng;
        }

        callInsert(callback);
      });
    }
  };
}

//------------- Public functions -------------//

// Checks the user in
CheckIn.prototype.submitCheckIn = function(eventId, callback) {
  var self = this;
  self.checkingIn.set(true);

  // This makes sure checkingIn never stays true on error
  function newCallback(error, result) {
    self.checkingIn.set(false);
    callback( error, result );
  }

  // If the photo exists, use the photo ID, otherwise proceed without one
  if( self.userPhoto && self.userPhoto.photoURI.get() ) {
    self.userPhoto.insert(function(err, fileObj) {
      if ( err ) {
        newCallback(err, null);
      } else {
        self.insertTransaction(eventId, fileObj._id, newCallback);
      }
    });
  } else {
    self.insertTransaction(eventId, null, newCallback);
  }
};

// Gets the base64 photo URI
CheckIn.prototype.getPhoto = function() {
  return this.userPhoto.photoURI.get();
};

// Pops up the takephoto modal
CheckIn.prototype.takePhoto = function() {
  return this.userPhoto.takePhoto();
};

// Removes the photo
CheckIn.prototype.removePhoto = function() {
  this.userPhoto.remove();
};

