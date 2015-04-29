Template.editEvent.rendered = function() {
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
  }
});

Template.editEvent.events({
  'click #back': function(e) {
    Router.go('manageEvents');
  },
  'click #submit': function(e) {
    Router.go('manageEvents');
  }
});
