AutoForm.hooks({
  insertEventsForm: {
    before: {
      insert: function(doc, template) {
        doc.latitude = Session.get('latitude');
        doc.longitude = Session.get('longitude');
        doc.endTime = addHours(moment(doc.eventDate).toDate(), doc.duration);
        //UTC is not DST sensitive. So during Winter the US East Coast (EST) is
        //5 hours behind UTC, but during summer it is 4 hours behind
        if(moment(doc.eventDate).isDST()) {
          doc.eventDate = moment(doc.eventDate).subtract(1, 'hours').toDate();
          doc.endTime = moment(doc.endTime).subtract(1, 'hours').toDate();
        }
        return doc;
      }
    }
  }
});

Template.addEvents.rendered = function() {
  Session.set('latitude', null);
  Session.set('longitude', null);
  Session.set('displayPointsPerHour', false);
};

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
  }
});

Template.addEvents.events({
  'click #geocodeButton': function(e) {
    e.preventDefault();
    eventAddress = $('#eventAddress').val();
    if (eventAddress === '') {
      addErrorMessage('Please specify an Event Address')
    } else {
      Meteor.call('geocodeAddress', eventAddress,
                  function(error, result) {
                    if(error) {
                      addErrorMessage(error.reason);
                      Router.go('addEvents');
                    } else {
                      addSuccessMessage("Geocoding complete: Lat = " + result.location.lat + ", Long = " + result.location.lng)
                      Session.set('latitude', result.location.lat);
                      Session.set('longitude', result.location.lng);
                    }
                  })
    };
  },
  'change #pointsType': function(e) {
    Session.set('displayPointsPerHour', 
                $("input[type='radio'][name='isPointsPerHour']:checked").val());
  },
  'click #back': function(e) {
    Router.go('manageEvents');
  }
});
