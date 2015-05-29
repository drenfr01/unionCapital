Template.partnerAdminHomePage.helpers({
  userProfile: function() {
    return Meteor.user() ? Meteor.user().profile : null;
  }
});
Template.partnerAdminHomePage.events({
  'click #partnerMembers': function(e) {
    e.preventDefault();
    //member search handles security for this
    Router.go('allMembers');
  },
  'click #approvePoints': function(e) {
    e.preventDefault();
    Router.go('approveTransactions');
  },
  'click #manageEvents': function(e) {
    e.preventDefault();
    Router.go('manageEvents');
  },
  'click #exportData': function(e) {
    e.preventDefault();
    Router.go('exportData');
  }
});
