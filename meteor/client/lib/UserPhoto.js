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
  }
});
