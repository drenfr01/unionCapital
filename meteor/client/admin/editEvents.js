AutoForm.hooks({
  updateEventsForm: {
    onSuccess: function(formType, result) {
      addSuccessMessage("Event Successfully Changed!");
    }
  }
});

Template.editEvent.rendered = function() {
  //TODO: this is because the radio button values
  //return true and false in string form,
  //while the object property is stored as a 
  //boolean.
  if(this.data.isPointsPerHour) {
    Session.set("displayPointsPerHour", "true");
  } else {
    Session.set("displayPointsPerHour", "false");
  }
};

Template.editEvent.helpers({
  editingDoc: function() {
    return Events.findOne(this._id);
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

Template.editEvent.events({
  'click #back': function(e) {
    addSuccessMessage("Event Successfully Changed!");
    Router.go('manageEvents');
  },
  'click #submit': function(e) {
    //Router.go('manageEvents');
  },
  'change #pointsType': function(e) {
    Session.set('displayPointsPerHour', 
                $("input[type='radio'][name='isPointsPerHour']:checked").val());
  },
});
