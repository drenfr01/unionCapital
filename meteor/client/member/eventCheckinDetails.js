/* global wNumb */
/* global CheckIn */
/* global CheckInExistingEvent */
/* global CheckInNewEvent */
/* global EventCategories */
/* global Addons */
/* global addErrorMessage */
/* global addSuccessMessage */

const defaultHours = 1;
let checkIn = {};

function validateFields() {
  return $('#eventName').val() && $('#eventDescription').val();
}

function validateNewEventForms() {
  const forms = ['#eventDescForm', '#organizationForm', '#adHocEventDate'];
  forms.forEach(selector => $(selector).validate());
  return forms.every(selector => $(selector).valid());
}

function addPlugins(hours) {
  $('#durationSlider').noUiSlider({
    start: [hours],
    range: {
      min: [0],
      max: [8],
    },
    step: 0.5,
    format: wNumb({
      decimals: 1,
    }),
  });

  $('#durationSlider').noUiSlider_pips({
    mode: 'values',
    values: [0,1,2,3,4,5,6,7,8],
  });

  $('.input-group.date').datepicker({
    autoclose: true,
    todayHighlight: true,
    orientation: 'top',
  });
}

function getAddOns(element) {
  return $(element)
    .map(function() {
      return {
        name: this.name,
        points: parseInt(this.value, 10),
      };
    })
    .get();
}

Template.eventCheckinDetails.onCreated(function() {
  this.subscribe('eventCategories');
  this.subscribe('addons');
  checkIn = new CheckIn(defaultHours);

  // TODO: remove this
  window.test = checkIn;
});

Template.eventCheckinDetails.rendered = function() {
  addPlugins();
};

Template.selfieEventInfo.onRendered(function() {
  addPlugins(checkIn.getHoursSpent());
});

Template.selfieEventInfo.helpers({
  selectedSuperCategory: function() {
    return checkIn.getSuperCategory();
  },

  categories: function() {
    return checkIn.getAvailableCategories();
  },
});

Template.timeAttendingPanel.helpers({
  timeAttending: function() {
    return checkIn ? checkIn.getHoursSpent() : defaultHours;
  },
});

Template.addonCheckboxPanel.helpers({
  addons: function() {
    return Addons.find(); 
  },
});

Template.generalCheckinInfo.helpers({
  hasPhoto: function() {
    return checkIn ? checkIn.getPhoto() : false;
  },
});

Template.checkinChooseSupercategory.helpers({
  supercategories: function() {
    return checkIn.getAvailableSuperCategories();
  },
});

Template.selfieEventPanel.helpers({
  chooseSupercategory: function() {
    return !checkIn.getSuperCategory();
  },
});

Template.eventCheckinDetails.helpers({
  checkingIn: function() {
    if (checkIn && checkIn.checkingIn.get()) {
      return 'none';
    }
    return '';
  },

  recognized: function() {
    return !(Router.current().params.id === 'new');
  },
});

Template.eventCheckinDetails.events({
  'change #durationSlider': function() {
    checkIn.setHoursSpent($('#durationSlider').val());
  },

  'click .choose-supercategory-link': function(e) {
    e.preventDefault();
    checkIn.setSuperCategory(this.name);
  },

  'click #addPhoto': function(e) {
    e.preventDefault();
    // checkIn.takePhoto();
    $('#upPhoto').click();
  },

  'change #upPhoto':  function() {
    var input = $('#upPhoto')[0];

    if (input.files && input.files[0]) {
      checkIn.setPhoto(input.files[0]);
    } else {
      checkIn.removePhoto();
    }
  },

  // Async, pass the checkin
  'click .check-in': function(e) {
    e.preventDefault();
    const eventId = Router.current().params.id;

    let event = null;
    let isValid = true;

    if (eventId === 'new') {
      const eventName = $('#eventName').val();
      const eventDescription = $('#eventDescription').val();
      const category = $('#categories').val();
      const eventDate = new Date($('#adHocEventDate').val());

      event = new CheckInNewEvent(eventName, eventDescription, category, eventDate);

      isValid = validateNewEventForms();
    } else {
      event = new CheckInExistingEvent(eventId);
    }

    checkIn.setEvent(event);

    if(isValid) {
      checkIn.submitCheckIn()
        .then(function(result) {
          if (result === 'not_allowed') {
            addErrorMessage('This type of check-in is not allowed');
          } else if (result === 'auto') {
            addSuccessMessage('Sucessfully checked in!');
            Router.go('memberHomePage');
          } else {
            addSuccessMessage('Check-in submitted for approval');
            Router.go('memberHomePage');
          }
        })
        .catch(function(err) {
          addErrorMessage(err.reason || err.message);
        });
    } else {
      addErrorMessage('Please fill out all fields');
    }
    return false;
  },

  'click #back': function(e) {
    e.preventDefault();
    Router.go('checkin');
  },

  'click #photoPanel': function() {
    checkIn.removePhoto();
  },

  'change #addonForm': function() {
    const addons = getAddOns('.addons:checkbox:checked');
    checkIn.setAddons(addons);
  },
});

Template.eventCheckinDetails.destroyed = function () {
  // make sure to free the memory since this is in the closure, not the template
  checkIn = {};
};
