Template.adminHomePage.events({
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
    Router.go('addCommunityEvents');
  }
});
