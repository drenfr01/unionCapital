Template.partnerAdminView.helpers({
  partnerAdmins: function() {
    return Meteor.users.find({roles: {$in: ['partnerAdmin'] }});
  }
});

Template.partnerAdminView.events({
});
