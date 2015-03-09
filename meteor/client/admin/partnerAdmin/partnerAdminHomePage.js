Template.partnerAdminHomePage.helpers({
  firstName: function() {
    return Meteor.user().profile.firstName;
  },
  lastName: function() {
    return Meteor.user().profile.lastName;
  }
});
Template.partnerAdminHomePage.events({
  'click #partnerMembers': function(e) {
    e.preventDefault();
    Router.go('partnerMembers');
  },
  'click #memberProfiles': function(e) {
    e.preventDefault();
    Router.go('memberProfiles');
  },
  'click #approvePoints': function(e) {
    e.preventDefault();
    Router.go('reviewPhotos');
  },
  'click #manageEvents': function(e) {
    e.preventDefault();
    Router.go('manageEvents');
  }
});
