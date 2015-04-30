var defaultHours = 3;
var checkIn = {};

Template.eventCheckinDetails.created = function() {
  checkIn = new CheckIn(defaultHours);
};

Template.eventCheckinDetails.rendered = function() {

  $('#durationSlider').noUiSlider({
    start: [defaultHours],
    range: {
      min: [0],
      max: [8]
    },
    step: 0.5,
    format: wNumb({
      decimals: 1
    })
  });

  $('#durationSlider').noUiSlider_pips({
    mode: 'values',
    values: [0,1,2,3,4,5,6,7,8]
  });
};

Template.eventCheckinDetails.helpers({

  'timeAttending': function() {
    return checkIn ? checkIn.hours.get() : defaultHours;
  },

  'hasPhoto': function() {
    return checkIn ? checkIn.getPhoto() : false;
  },

  checkingIn: function() {
    return checkIn ? checkIn.checkingIn.get() : false;
  },

  adHoc: function() {
    return Router.current().params.id === 'new';
  },
  categories: function() {
    return EventCategories.find();  
  } 
});

Template.eventCheckinDetails.events({

  'change #durationSlider': function() {
    checkIn.hours.set($('#durationSlider').val());
  },

  'click #addPhoto': function(e) {
    e.preventDefault();
    checkIn.takePhoto();
  },

  // Async, pass the checkin
  'click .check-in': function(e) {
    e.preventDefault();

    var eventId = Router.current().params.id;

    // Set the event name if it is an ad hoc transaction
    if (eventId === 'new') {
      checkIn.pendingEventName = $('#pendingEventName').val();
      checkIn.pendingEventDescription = $('#pendingEventDescription').val();
      checkIn.eventCategory = $('#categories').val();
      checkIn.eventTime = $('#eventTime').val();
    }

    // Do the form validation here, then call the submit function
    checkIn.submitCheckIn(eventId, function(error, result) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        if (result  === 'not_allowed')
          addErrorMessage('This type of check-in is not allowed');
        else if (result === 'auto') {
          addSuccessMessage('Sucessfully checked in!');
          Router.go('memberHomePage');
        } else {
          addSuccessMessage('Check-in submitted for approval');
          Router.go('memberHomePage');
        }
      }
    });
  },

  'click #back': function(e) {
    e.preventDefault();
    Router.go('checkin');
  },

  'click #photoPanel': function() {
    checkIn.removePhoto();
  }
});

Template.eventCheckinDetails.destroyed = function () {
  //TODO: JSLint gives an error that variables shouldn't be deleted
  //maybe just reassign it to a blank object?
  delete checkIn;
};

function validateFields() {
  return $('#pendingEventName').val() && $('#pendingEventDescription').val();
}

// TODO:
// Find out how it is inserting the event/transactions, I don't think it's working correctly
