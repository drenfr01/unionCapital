/* global Roles */
/* global PartnerOrgs */
/* global EventCategories */
/* global addHours */
/* global R */
/* global AutoForm */

const whitelist = new Mongo.Collection(null);

function getWhitelistIds(wl) {
  const options = { fields: { _id: 1 } };
  return R.pluck('_id', wl.find({}, options).fetch());
}

AutoForm.hooks({
  insertEventsForm: {
    before: {
      insert: function(doc) {
        return {
          ...doc,
          adHoc: false,
          latitude: Session.get('latitude'),
          longitude: Session.get('longitude'),
          endTime: addHours(moment(doc.eventDate).toDate(), doc.duration),
          privateWhitelist: getWhitelistIds(whitelist),
        };
      },
    },
    onSuccess: function() {
      sAlert.success('Event successfully added!');
      Router.go('manageEvents')
    },
    onError: function(formType, error) {
      sAlert.error(error);
    },
  },
});

var isPrivateEvent = new ReactiveVar(false);

Template.addEvents.onCreated(function() {
  this.subscribe('eventCategories');
  this.subscribe('partnerOrganizations');
  this.subscribe('allUsers');
  this.superCategory = new ReactiveVar(null);
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
      return PartnerOrgs.find({}, {sort: {name: 1}}).map(
        function(institution) {
          return {label: institution.name, value: institution.name};
      });
    }

    //partner admins can only have 1 partner org affiliation
    const institution = Meteor.user().primaryPartnerOrg();
    return [{
      label: institution,
      value: institution
    }];
  },

  superCategories: function() {
    return EventCategories.getSuperCategories();
  },
  categories: function() {
    const template = Template.instance();
    return EventCategories
      .getCategoriesForSuperCategory(template.superCategory.get())
      .map(category => ({ label: category, value: category }));
  },
  isPointsPerHour: function() {
    return Session.equals("displayPointsPerHour", "true");
  },
  isPrivateEvent: function() {
    if(isPrivateEvent.get() === 'true') {
      return true;
    }
    return false 
  },

  //TODO: note to make this server side you have
  //to have the same arguments found here:
  //https://github.com/mizzao/meteor-autocomplete/blob/master/autocomplete-server.coffee
  //TODO: make sure fields are covered by index
  settings: function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [{
        token: '@',
        collection: UCBMembers,
        field: "profile.firstName",
        template: Template.userTemplate,
      }, {
        token: '!',
        collection: PartnerOrgs,
        field: "name",
        options: '',
        template: Template.partnerOrgTemplate,
      }],
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
    }
    return "Unknown type of whitelist";
  }
  
});

Template.addEvents.events({
  'click #geocodeButton': function(e) {
    e.preventDefault();
    eventAddress = $('#eventAddress').val();
    if (eventAddress === '') {
      sAlert.error('Please specify an Event Address');
    } else {
      Meteor.call('geocodeAddress', eventAddress,
                  function(error, result) {
                    if(error) {
                      sAlert.error(error.reason);
                      Router.go('addEvents');
                    } else {
                      sAlert.success("Geocoding complete: Lat = " + result.latitude + ", Long = " + result.longitude);
                      Session.set('latitude', result.latitude);
                      Session.set('longitude', result.longitude);
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
      sAlert.error('You must add the number of points per hour');
      return false;
    }

    if (!$('#super-cat-select').val()) {
      sAlert.error('You must add an event category');
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
  },

  'change #super-cat-select': function(e, template) {
    template.superCategory.set(e.target.value);
  },
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
