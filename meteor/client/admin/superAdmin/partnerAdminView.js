Template.partnerAdminView.helpers({
  partnerAdmins: function() {
    return Meteor.users.find({roles: {$in: ['partnerAdmin'] }});
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
