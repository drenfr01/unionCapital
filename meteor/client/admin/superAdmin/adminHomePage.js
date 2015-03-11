Template.adminHomePage.events({
  'click #allMembers': function(e) {
    e.preventDefault();
    Router.go('allMembers');
  },
  'click #partnerOrgs': function(e) {
    e.preventDefault();
    Router.go('partnerOrgs');
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
