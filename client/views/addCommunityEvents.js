AutoForm.hooks({
  insertEventsForm: {
    before: {
      insert: function(doc, template) {
        doc.latitude = Session.get('latitude');
        doc.longitude = Session.get('longitude');
        //UTC is not DST sensitive. So during Winter the US East Coast (EST) is 
        //5 hours behind UTC, but during summer it is 4 hours behind
        if(moment(doc.startDate).isDST()) {
          doc.startDate = moment(doc.startDate).subtract('hours',1).toDate();
          doc.endDate = moment(doc.endDate).subtract('hours',1).toDate();
        }
        return doc;
      } 
    }
  }
});
Template.addCommunityEvents.rendered = function() {
  Session.set('showMap', false);
  Session.set('latitude', null);
  Session.set('longitude', null);
  Session.set('displayPointsPerHour', false);
};

Template.addCommunityEvents.helpers({
  'addEventClicked': function() {
    return Session.get('addEventClicked');
  },
  'showMapClicked': function() {
    return Session.get('showMap');
  },
  'geocodeResultsReturned': function() {
    return Session.get('latitude');
  },
  'displayPointsPerHour': function() {
    return Session.get('displayPointsPerHour');
  }
});

Template.addCommunityEvents.events({
  'click #showMap': function(e) {
    e.preventDefault();
    Session.set('showMap', true);
  },
  'click #hideMap': function(e) {
    e.preventDefault();
    Session.set('showMap', false);
  },
  'click #geocodeButton': function(e) {
    e.preventDefault();
    Meteor.call('geocodeAddress', $('#eventAddress').val(), 
                function(error, result) {
                  if(error) {
                    addErrorMessage(error.reason);
                    Router.go('addCommunityEvents');
                  } else {
                    Session.set('latitude', result.location.lat);
                    Session.set('longitude', result.location.lng);
                  }
                });
  },
  'click #pointsCheckbox': function(e) {
    Session.set('displayPointsPerHour', $('#pointsCheckbox').prop('checked'));
  }
});
