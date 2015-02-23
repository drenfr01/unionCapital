Template.partnerAdminHomePage.helpers({
  firstName: function() {
    return Meteor.user().profile.firstName;
  },
  lastName: function() {
    return Meteor.user().profile.lastName;
  }
});
