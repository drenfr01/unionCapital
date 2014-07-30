AutoForm.hooks({
  insertEventsForm: {
    before: {
      insert: function(doc, template) {
        doc.latitude = Session.get('latitude');
        doc.longitude = Session.get('longitude');
        return doc;
      } 
    }
  }
});
Template.addCommunityEvents.rendered = function() {
  Session.set('showMap', false);
  Session.set('latitude', null);
  Session.set('longitude', null);
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
    console.log('Geocode button clicked: ' + $('#eventAddress').val());
    Meteor.call('geocodeAddress', $('#eventAddress').val(), 
                function(error, result) {
                  if(error) {
                    addErrorMessage(error.reason);
                    Router.go('addCommunityEvents');
                  } else {
                    console.log(result.location);
                    Session.set('latitude', result.location.lat);
                    Session.set('longitude', result.location.lng);
                  }
                });
  }
});
