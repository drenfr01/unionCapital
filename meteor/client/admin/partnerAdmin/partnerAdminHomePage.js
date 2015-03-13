Template.partnerAdminHomePage.helpers({
  userProfile: function() {
    return Meteor.user().profile;
  }
});
Template.partnerAdminHomePage.events({
  'click #partnerMembers': function(e) {
    e.preventDefault();
    //member search handles security for this
    Router.go('allMembers');
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
