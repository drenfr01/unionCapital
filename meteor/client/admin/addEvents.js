AutoForm.hooks({
  insertEventsForm: {
    before: {
      insert: function(doc, template) {
        doc.adHoc = false;
        doc.latitude = Session.get('latitude');
        doc.longitude = Session.get('longitude');
        doc.endTime = addHours(moment(doc.eventDate).toDate(), doc.duration);
        console.log(R.pluck('_id',whitelist.find({}, {fields: {_id: 1}}).fetch()));
        doc.privateWhitelist = R.pluck('_id', whitelist.find({}, 
          {fields: {_id: 1}}).fetch());
        return doc;
      }
    },
    onSuccess: function() {
      addSuccessMessage('Event successfully added!');
      Router.go('manageEvents')
    },
    onError: function(formType, error) {
      addErrorMessage(error);
    }
  }
});

Template.addEvents.onCreated(function() {
  this.subscribe('eventCategories');
});

Template.addEvents.onRendered(function() {
  whitelist.remove({});
  Session.set('latitude', null);
  Session.set('longitude', null);
  Session.set('displayPointsPerHour', false);
});

Template.addEvents.helpers({
  'geocodeResultsReturned': function() {
    return Session.get('latitude');
  },
  institutions: function() {
    if(Roles.userIsInRole(Meteor.userId(), "admin")) {
      return PartnerOrgs.find().map(function(institution) {
        return {label: institution.name, value: institution.name};
      });
    } else {
      var institution = Meteor.user().profile.partnerOrg;
      return [{label: institution, value: institution}];
    }
  },
  categories: function() {
    return EventCategories.find().map(function(category) {
      return {label: category.name, value: category.name};
    });
  },
  isPointsPerHour: function() {
    return Session.equals("displayPointsPerHour", "true");
  },
  
});

Template.addEvents.events({
  'click #geocodeButton': function(e) {
    e.preventDefault();
    eventAddress = $('#eventAddress').val();
    if (eventAddress === '') {
      addErrorMessage('Please specify an Event Address');
    } else {
      Meteor.call('geocodeAddress', eventAddress,
                  function(error, result) {
                    if(error) {
                      addErrorMessage(error.reason);
                      Router.go('addEvents');
                    } else {
                      addSuccessMessage("Geocoding complete: Lat = " + result.location.lat + ", Long = " + result.location.lng);
                      Session.set('latitude', result.location.lat);
                      Session.set('longitude', result.location.lng);
                    }
                  });
    }
  },
  'change #pointsType': function(e) {
    Session.set('displayPointsPerHour',
                $("input[type='radio'][name='isPointsPerHour']:checked").val());
  },
  'click #back': function(e) {
    Router.go('manageEvents');
  },


  'click #submit': function(e) {
    var isPph = $("input[type='radio'][name='isPointsPerHour']:checked").val();
    var pph = $('#insertEventsForm input[name="pointsPerHour"]').val();
    if (isPph === "true" && !pph) {
      addErrorMessage('You must add the number of points per hour');
      return false;
    }

    return true;
  },
});
