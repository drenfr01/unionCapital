
Template.partnerAdminView.onCreated(function() {
  this.subscribe('partnerAdminUsers');
});

Template.partnerAdminView.helpers({
  partnerAdmins: function() {
    return Meteor.users.find();
  }
});

Template.partnerAdminView.events({
  'click #viewPartnerOrgs': function(e) {
    Router.go('partnerOrgs');
  },
  'click #addPartnerAdminUser': function(e) {
    e.preventDefault();
    Router.go('addPartnerAdminUser');
  }
});
