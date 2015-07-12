UserPhoto = function() {
  var self = this;

	// True if the last photo attempted to be taken has failed
	self.takePhotoFailed = new ReactiveVar(false);

	// Data URI of a successful photo
	self.photoURI = new ReactiveVar(null);
};

_.extend(UserPhoto.prototype, {
  // Inserts the photo into the collection
  insert: function(callback) {

    var self = this;

    if (self.photoURI.get()) {
      var newFile = new FS.File(self.photoURI.get());
      var currentDate = new Date();

      newFile.metadata = {
        userId: Meteor.userId(),
        type: 'userEvent',
        submissionTime: currentDate
      };

      // photoURI can be several megs, better null it out
      var imageId = Images.insert(newFile, function(err, res) {
        !err && self.photoURI.set(null);
        callback(err,res);
      })._id;
      return imageId;
    } else {
       callback && callback({ reason: 'There is no file URI' });
    }
  },

  // Deletes photo reference
  remove: function() {
    var self = this;

    self.photoURI.set(null);
  },

  // Uses mdg:camera to take a photo and store it locally
  // WARNING: Deprecated for now. Only works with PhoneGap and PC
  // Does not work with mobile browsers
  // Use setPhotoURI instead
  takePhoto: function() {

    var self = this;
    MeteorCamera.getPicture({
      quality: 30
    }, function(err, data) {

      if (err) {

        self.takePhotoFailed.set(true);
        addErrorMessage(err.reason);

      } else {

        self.takePhotoFailed.set(false);
        self.photoURI.set(data);
      }
    });
  },

  // Uses a FileReader to grab the data from the input element that is passed as an argument
  setPhotoURI: function(inputElement) {
    var self = this;
    var reader = new FileReader();

    reader.onerror = function(res) {
      self.takePhotoFailed.set(true);
      addErrorMessage('Unable to save your photo. Please try again.');
    };

    reader.onload = function(res) {
      self.takePhotoFailed.set(false);
      self.resizeDataURI(reader.result);
    };

    reader.readAsDataURL(inputElement);
  },

  resizeDataURI: function(data) {
    var self = this;

    // We create an image to receive the Data URI
    var img = document.createElement('img');

    // When the event "onload" is triggered we can resize the image.
    img.onload = function() {
      // We create a canvas and get its context.
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');

      var maxWidth = AppConfig.checkIn.maxPhotoDimensions.width;
          maxHeight = AppConfig.checkIn.maxPhotoDimensions.height;
          imageWidth = img.width,
          imageHeight = img.height;

      if (imageWidth > imageHeight) {
        if (imageWidth > maxWidth) {
          imageHeight *= maxWidth / imageWidth;
          imageWidth = maxWidth;
        }
      } else {
        if (imageHeight > maxHeight) {
          imageWidth *= maxHeight / imageHeight;
          imageHeight = maxHeight;
        }
      }

      // We set the dimensions at the wanted size.
      canvas.width = imageWidth;
      canvas.height = imageHeight;

      // We resize the image with the canvas method drawImage();
      ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

      var dataURI = canvas.toDataURL();
      self.photoURI.set(dataURI);
    };

    // We put the Data URI in the image's src attribute
    img.src = data;
  }
});
