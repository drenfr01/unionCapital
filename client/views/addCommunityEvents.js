AutoForm.hooks({
  insertEventsForm: {
    before: {
      insert: function(doc, template) {
        console.log(result);
        doc.latitude = result.location.lat;
        doc.longitude = result.location.lng;
        return doc;
      } 
    }
  }
});
Template.addCommunityEvents.rendered = function() {
  Session.set('showMap', false);
};

Template.addCommunityEvents.helpers({
  'addEventClicked': function() {
    return Session.get('addEventClicked');
  },
  'showMapClicked': function() {
    return Session.get('showMap');
  },
  'geocodeResultsReturned': function() {
    if(Session.get('latitude')) {
      return true;
    } else {
      return false;
    }
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
    Meteor.call('geocodeAddress', doc.address, 
      function(error, result) {
        if(error) {
          addErrorMessage(error.reason);
          Router.go('addCommunityEvents');
        } else {
          Session.set('latitude', result.location.lat);
          Session.set('longitude', result.location.lng);
        }
    });
  }
});
