//TODO: this code sucks, please clean it up
var photoType = "userEvent";
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
      var imageId = Images.insert(newFile, function(error, fileObj) {
        if(error) {
          addErrorMessage(error.reason);
        }
      })._id;
      Session.set('imageId', imageId);
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
  Meteor.call('removeImage', image.id, function(error) {
    if(error) {
      addErrorMessage(error.reason);
    }
    $('#userInput').val('');
    Session.set('imageLoaded', false);
  });
}

Template.takePicture.rendered = function() {
  Session.set('imageLoaded', false);
  Session.set('imageId', null);
  Session.set('eventName', null);
  Session.set('timeEntered', false);
  var currentDate = moment().format("YYYY-MM-DD");
  $('#eventDate').val(currentDate);
  if(this.data) {
    $('#eventName').prop('readonly',true);
    $('#eventName').val(this.data.name);
    $('#eventDescription').prop('readonly',true);
    $('#eventDescription').val(this.data.description);}
    $('#eventDate').prop('readonly',true);
};

//TODO: this code needs to be DRY
Template.takePicture.events({
  'keyup #eventName': function(e) {
    e.preventDefault();
    Session.set('eventName', $('#eventName').val());
  },
  'change .time': function(e) {
    e.preventDefault();
    Session.set('timeEntered', true);
  },
  'change #userInput': function(e) {
    e.preventDefault(); 

    files = e.target.files; 
    //TODO: get Jquery preview working
    //$('#eventImage').attr('src', e.target.value).width(400).height(400); 

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
    
    //TODO: this is probably a security risk to only check on
    //the client side. Should implement server side checks
    var eventName = Session.get('eventName');
    var imageId = Session.get('imageId') || "";
    var eventDescription = $('#eventDescription').val();

    if(eventName && Session.get('timeEntered') ) {
    
      var attributes = {
        userId: Meteor.userId(),
        imageId: imageId,
        eventId: this._id,
        needsApproval: true,
        hoursSpent: parseInt($('#hours').val(),10),
        minutesSpent: parseInt($('#minutes').val(),10),
        pendingEventName: eventName,
        pendingEventDescription: eventDescription,
        transactionDate: Date()
      };
      
      Meteor.call('insertTransaction', attributes, function(error) {
        if(error) {
          addErrorMessage(error.reason);
          Router.go('submitNewEvent'); 
        } else {
          addSuccessMessage('Transaction successfully submitted');
          Router.go('memberHomePage');
        }
      }); 
    } else {
      addErrorMessage('Please ensure you have filled in a name, time spent, ' +
                      ' and taken a photo');
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
  },
  formComplete: function() {
    if(Session.get('imageId') && Session.get('eventName') &&
       Session.get('timeEntered')) {
      return true;
    } else {
      return false;
    }
  }
});


