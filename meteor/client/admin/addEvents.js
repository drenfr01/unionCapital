var whitelist = new Mongo.Collection(null);

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

var isPrivateEvent = new ReactiveVar(false);

Template.addEvents.onCreated(function() {
  this.subscribe('eventCategories');
  this.subscribe('partnerOrganizations');
  this.subscribe('allUsers');
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
  },
  isPrivateEvent: function() {
    if(isPrivateEvent.get() === 'true') {
      return true;
    } else {
      return false 
    }
  },

  //TODO: note to make this server side you have
  //to have the same arguments found here:
  //https://github.com/mizzao/meteor-autocomplete/blob/master/autocomplete-server.coffee
  //TODO: make sure fields are covered by index
  settings: function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
        token: '@',
        collection: UCBMembers,
        field: "profile.firstName",
        template: Template.userTemplate,
      },
      {
        token: '!',
        collection: PartnerOrgs,
        field: "name",
        options: '',
        template: Template.partnerOrgTemplate
      }
      ]
    };  
  },

  currentWhitelist: function() {
    return whitelist.find(); 
  },

  whitelistIdentifier: function() {
    if(this.profile) { //Members
      return this.profile.firstName + " " + this.profile.lastName;
    } else if (this.name) { //Partner Orgs
      return this.name; 
    } else {
      return "Unknown type of whitelist";
    }
  }
  
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

  'click #privateEvent': function(e) {
    isPrivateEvent.set(e.target.value);
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

  "autocompleteselect input": function(event, template, doc) {
    whitelist.insert(doc);
    $('#msg').val('');
  },

  'click .glyphicon-remove': function(e) {
    whitelist.remove(this._id);
  }
});

Template.userTemplate.helpers({
  email: function() {
    if(this && this.emails[0]) {
      return this.emails[0].address; 
    } else {
      return 'No Email';
    }
  }
})
