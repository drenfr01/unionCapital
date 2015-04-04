AutoForm.hooks({
  insertEventsForm: {
    before: {
      insert: function(doc, template) {
        doc.latitude = Session.get('latitude');
        doc.longitude = Session.get('longitude');
        //UTC is not DST sensitive. So during Winter the US East Coast (EST) is
        //5 hours behind UTC, but during summer it is 4 hours behind
        if(moment(doc.startDate).isDST()) {
          doc.startDate = moment(doc.startDate).subtract(1, 'hours').toDate();
          doc.endDate = moment(doc.endDate).subtract(1, 'hours').toDate();
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
  }
});

Template.addEvents.events({
  'click #geocodeButton': function(e) {
    e.preventDefault();
    Meteor.call('geocodeAddress', $('#eventAddress').val(),
                function(error, result) {
                  if(error) {
                    addErrorMessage(error.reason);
                    Router.go('addEvents');
                  } else {
                    addSuccessMessage("Latitude: " + result.location.lat);
                    addSuccessMessage("Longitude: " + result.location.lng);
                    Session.set('latitude', result.location.lat);
                    Session.set('longitude', result.location.lng);
                  }
                });
  },
  'click #pointsCheckbox': function(e) {
    Session.set('displayPointsPerHour', $('#pointsCheckbox').prop('checked'));
  },
  'click #back': function(e) {
    Router.go('manageEvents');
  }
});
