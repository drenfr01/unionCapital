/* global UserPhoto */
/* global ReactiveVar */
/* global Promise */
/* global Geolocation */
/* global R */
/* global EventCategories */

/* global CheckIn:true */
/* global CheckInExistingEvent:true */
/* global CheckInNewEvent:true */

const filterNullAndUndefined = R.filter(R.complement(R.isNil));

function callInsert(attributes) {
  return new Promise(function(resolve, reject) {
    Meteor.call( 'insertTransaction', attributes, function(err, approvalType) {
      if (err) {
        reject(err);
      } else {
        resolve(approvalType);
      }
    });
  });
}

async function getValidatedAttributes(addons, event, hours, userId, geolocation, imageId) {
  try {
    const latLng = await geolocation.getCurrentLocation();
    const hoursSpent = parseFloat(hours.get()) || 0;
    const attributes = filterNullAndUndefined({
      ...event,
      ...latLng,
      imageId,
      addons,
      hoursSpent,
      userId,
    });

    check(attributes, {
      imageId: Match.Maybe(String),
      userId: String,
      hoursSpent: Number,
      eventId: String,
      eventName: Match.Maybe(String),
      eventDescription: Match.Maybe(String),
      eventDate: Match.Maybe(Date),
      eventType: Match.Maybe(String),
      category: Match.Maybe(String),
      userLat: Match.Maybe(Number),
      userLng: Match.Maybe(Number),
      addons: [Object],
    });

    return attributes;
  } catch (err) {
    throw err;
  }
}

// -> Promise -> ?imageId
function uploadUserPhotoIfExists(userPhoto) {
  if (userPhoto.constructor !== UserPhoto) {
    throw new Error('Invalid user photo object');
  }

  return new Promise(function(resolve, reject) {
    if(userPhoto.photoURI.get()) {
      userPhoto.insert(function(err, fileObj) {
        if (err) {
          reject(err);
        } else {
          resolve(fileObj._id);
        }
      });
    } else {
      resolve(null);
    }
  });
}

CheckInExistingEvent = function(eventId) {
  check(eventId, String);

  const { name, description, category, eventDate } = Events.findOne(eventId);
  this.eventId = eventId;
  this.eventName = name;
  this.eventDescription = description;
  this.category = category;
  this.eventDate = eventDate;
};

CheckInNewEvent = function(eventName, eventDescription, category, eventDate, 
                           eventType) {
  check(eventName, String);
  check(eventDescription, Match.Maybe(String));
  check(category, String);
  check(eventDate, Date);
  check(eventType, Match.Maybe(String));

  this.eventId = 'new'
  this.eventName = eventName;
  this.eventDescription = eventDescription;
  this.category = category;
  this.eventDate = eventDate;
  this.eventType = eventType;
};

CheckIn = function(defaultHours) {
  this.hours = new ReactiveVar(defaultHours);
  this.checkingIn = new ReactiveVar(false);
  this.userPhoto = new UserPhoto();
  this.geolocation = new Geolocation();
  this.superCategory = new ReactiveVar(null);
  this.event = null;
  this.addons = [];
};

// Checks the user in
CheckIn.prototype.submitCheckIn = async function submitCheckIn() {
  const { userPhoto, geolocation, addons, event, hours } = this;

  if (!userPhoto || !geolocation || !addons || !hours) {
    throw new Error('Missing needed arguments');
  }

  this.checkingIn.set(true);
  try {
    const userId = Meteor.userId();
    const imageId = await uploadUserPhotoIfExists(userPhoto);
    const attributes = await getValidatedAttributes(addons, event, hours, userId, geolocation, imageId);
    debugger
    const approvalType = await callInsert(attributes);

    this.checkingIn.set(false);
    return approvalType;

  } catch (error) {
    this.checkingIn.set(false);
    console.log(error);

    if (error.errorType === 'Meteor.Error') {
      throw error;
    } else if (error.errorType === 'Match.Error') {
      const keyErr = error.path ? `${error.path} is incorrect. Message: ` : '';
      throw new Meteor.Error('BAD_INPUT', keyErr + error.message);
    } else {
      throw new Meteor.Error('UNEXPECTED', 'Unexpected error, please try again');
    }
  }
};

CheckIn.prototype.setAddons = function(addons) {
  this.addons = addons;
};

CheckIn.prototype.setEvent = function(event) {
  this.event = event;
};

// Gets the base64 photo URI
CheckIn.prototype.getPhoto = function() {
  return this.userPhoto.photoURI.get();
};

// Pops up the takephoto modal
CheckIn.prototype.takePhoto = function() {
  return this.userPhoto.takePhoto();
};

// Manually set the photo URI
CheckIn.prototype.setPhoto = function(inputElement) {
  return this.userPhoto.setPhotoURI(inputElement);
};

// Removes the photo
CheckIn.prototype.removePhoto = function() {
  this.userPhoto.remove();
};

CheckIn.prototype.getAvailableSuperCategoriesWithIcons = function getAvailableSuperCategories() {
  return EventCategories.getSuperCategoriesWithIcons();
};

CheckIn.prototype.setSuperCategory = function setSuperCategory(val) {
  this.superCategory.set(val);
};

CheckIn.prototype.getSuperCategory = function getSuperCategory() {
  return this.superCategory.get();
};

CheckIn.prototype.getCategory = function getCategory() {
  return this.category.get();
};

CheckIn.prototype.getAvailableCategories = function getAvailableCategories() {
  return EventCategories.getCategoriesForSuperCategory(this.superCategory.get());
};

CheckIn.prototype.setHoursSpent = function getCategory(val) {
  return this.hours.set(val);
};

CheckIn.prototype.getHoursSpent = function getCategory() {
  return this.hours.get();
};
