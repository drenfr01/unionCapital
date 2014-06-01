var photoType = "userEvent";

function insertFiles(files, e, type) {
    FS.Utility.eachFile(e, function(file) {
      var newFile = new FS.File(file);
      var currentDate = new Date();
      newFile.metadata = {
        userId: Meteor.userId(),
        type: type,
        submissionTime: currentDate
      };
      Images.insert(newFile, function(error, fileObj) {
        if(error) {
          addErrorMessage(error.reason);
        }
      });
    });
}

function removeImages(type) {
  //TODO: note that Minimongo doesn't yet support findAndModify, so 
  //we have to do this clunky approach
  var image = Images.findOne({"metadata.type": type, 
    "metadata.userId": Meteor.userId()}, 
    {sort: {updatedAt: -1}, limit: 1});

    Images.remove(image._id);

  //TODO: ideally we would wait to batch submit the images, but
  //I couldn't think of a good way to store the event until a user
  //pressed a submit button
  Meteor.call('removeImage', image.id, function(error, imageId) {
    if(error) {
      addErrorMessage(error.reason);
    }
    $('#userInput').val('');
    Session.set('imageLoaded', false);
  });
}

Template.takePicture.rendered = function() {
  Session.set('imageLoaded', false);
};

//TODO: this code needs to be DRY
Template.takePicture.events({
  'change #userInput': function(e) {
    e.preventDefault(); 
    
    var files = e.target.files; 
    Session.set('imageLoaded', true);
    insertFiles(files, e, photoType);
  },
  'click #removeUserInput': function(e) {
    e.preventDefault();
    removeImages(photoType);    
  },
  'click #reviewOrder': function(e) {
    e.preventDefault();

    Router.go('memberHomePage');
    addSuccessMessage("Photos successfully submitted");
  },
});

Template.takePicture.helpers({
  images: function(type) {
    return Images.find({"metadata.type": type, 
      "metadata.userId": Meteor.userId()}, 
      {sort: {updatedAt: -1}, limit: 1});
  },
  imageLoaded: function() {
    return Session.get('imageLoaded');
  }
});


