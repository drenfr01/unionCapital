function insertFiles(files, e, view) {
    FS.Utility.eachFile(e, function(file) {
      var newFile = new FS.File(file);
      newFile.metadata = {customerId: Session.get('currentCustomer'),
        view: view};
      Images.insert(newFile, function(error, fileObj) {
        if(error) {
          throwError(error.reason);
        }
      });
    });
}

function removeImages(view) {
  //TODO: note that Minimongo doesn't yet support findAndModify, so 
  //we have to do this clunky approach
  var image = Images.findOne({"metadata.view": view, 
    "metadata.customerId": Session.get('currentCustomer')}, 
    {sort: {updatedAt: -1}, limit: 1});
  
    Images.remove(image._id);
    
  //TODO: ideally we would wait to batch submit the images, but 
  //I couldn't think of a good way to store the event until a user 
  //pressed a submit button
  Meteor.call('removeImage', image.id, function(error, imageId) {
    if(error) {
      throwError(error.reason);
    }
  });
}

//TODO: this code needs to be DRY
Template.takePicture.events({
  'change #photoInputFront': function(e) {
    e.preventDefault(); 
    
    var files = e.target.files; 
    insertFiles(files, e, "Front");
  },
  'click #removeFront': function(e) {
    e.preventDefault();
  
    removeImages("Front");    
  },
  'click #reviewOrder': function(e) {
    e.preventDefault();

    Router.go('memberHomePage');
    throwError("Photos successfully submitted", "alert-success");
  },
});

Template.takePicture.helpers({
  images: function(view) {
    return Images.find({"metadata.view": view, 
      "metadata.customerId": Session.get('currentCustomer')}, 
      {sort: {updatedAt: -1}, limit: 1});
  }
});


