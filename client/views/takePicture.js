var photoType = "userEvent";
var imageId;
var files;

function insertFiles(files, e, type) {
    FS.Utility.eachFile(e, function(file) {
      var newFile = new FS.File(file);
      var currentDate = new Date();
      newFile.metadata = {
        userId: Meteor.userId(),
        type: type,
        submissionTime: currentDate
      };
      imageId = Images.insert(newFile, function(error, fileObj) {
        if(error) {
          addErrorMessage(error.reason);
        }
      })._id;
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

    files = e.target.files; 
    //TODO: get Jquery preview working
    //$('#eventImage').attr('src', e.target.value).width(400).height(400); 

    console.log("File Name: " + e.target.files[0].name);

    $('#fileName').attr("placeholder", e.target.files[0].name);
    Session.set('imageLoaded', true);

    insertFiles(files, e, photoType);
  },
  'click #removeUserInput': function(e) {
    e.preventDefault();
    $('#fileName').attr("placeholder", "");
    removeImages(photoType);    
  },
  'click #submitEvent': function(e) {
    e.preventDefault();
    
    var eventName = $('#eventName').val();
    var eventDescription = $('#eventDescription').val();
    var transactionDate = $('#eventDate').val();

    if(eventName && eventDescription && transactionDate && imageId) {
    
    var attributes = {
      userId: Meteor.userId(),
      imageId: imageId,
      needsApproval: true,
      pendingEventName: eventName,
      pendingEventDescription: eventDescription,
      transactionDate: transactionDate 
    };

    Meteor.call('insertTransaction', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
        Router.go('takePicture'); 
      }
      addSuccessMessage('Transaction successfully submitted');
      Router.go('memberHomePage');
    }); 
    } else {
      addErrorMessage('Please ensure event name, description, ' +
                      'date, and photo are filled in');
    }
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


