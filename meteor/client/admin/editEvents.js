/* global EventCategories */
/* global AutoForm */
/* global addSuccessMessage */
/* global addErrorMessage */
/* global AutoForm */
/* global PartnerOrgs */
/* global Roles */

AutoForm.hooks({
    onSuccess: function(formType) {
      addSuccessMessage("Event Successfully Changed!");
    },

    onError: function(formType, error) {
      addErrorMessage(error);
    },
});

function insertData(docId) {
  const partnerOrg = PartnerOrgs.findOne({_id: docId});
  const user = UCBMembers.findOne({_id: docId});

  if(!R.isNil(partnerOrg)) {
    whitelist.insert(partnerOrg);  
  } else if(!R.isNil(user)) {
    whitelist.insert(user);
  } else {
    console.log("No match found for id: " + docId);
  }
}

Template.editEvent.onRendered(function() {
  //TODO: this is because the radio button values
  //return true and false in string form,
  //while the object property is stored as a 
  //boolean.
  if(this.data.isPointsPerHour) {
    Session.set("displayPointsPerHour", "true");
  } else {
    Session.set("displayPointsPerHour", "false");
  }

  whitelist.remove({});
  var whitelistData = this.data.privateWhitelist || [];
  var template = this;
  this.subscribe('partnerOrganizations');
  this.subscribe('allUsers');
  this.subscribe('eventCategories');

  this.superCategory = new ReactiveVar(null);

  template.autorun(function() {
    if(Template.instance().subscriptionsReady()) {
      whitelistData.forEach(insertData);
    }
  
  });

});

Template.editEvent.helpers({
  editingDoc: function() {
    return Events.findOne(this._id);
  },
  institutions: function() {
    if(Roles.userIsInRole(Meteor.userId(), "admin")) {
      return PartnerOrgs.find().map(function(institution) {
        return {label: institution.name, value: institution.name};
      });
    }
    const institution = Meteor.user().primaryPartnerOrg();
    return [{ label: institution, value: institution }];
  },

  categories: function() {
    return EventCategories
      .getAllCategories()
      .map(category => ({ label: category, value: category }));
  },

  isPointsPerHour: function() {
    return Session.equals("displayPointsPerHour", "true");
  },
});

Template.editEvent.events({
  'click #back': function(e) {
    addSuccessMessage("Event Successfully Changed!");
    Router.go('manageEvents');
  },
  'click #submit': function(e) {
    //Note: ideally this would be in an Autoform hook,
    //but I had issues getting it to work (it wouldn't accept
    //any return value I tried in the return of before.update
    const whitelistArray = R.pluck('_id', whitelist.find({}, {fields: {_id: 1}}).fetch());
    Events.update({_id: this._id}, {$set: {privateWhitelist: whitelistArray}});
    Router.go('manageEvents');
  },
  'change #pointsType': function(e) {
    Session.set('displayPointsPerHour', 
                $("input[type='radio'][name='isPointsPerHour']:checked").val());
  },
});
