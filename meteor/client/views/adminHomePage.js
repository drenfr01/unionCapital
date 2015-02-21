Template.adminHomePage.events({
  'click #listMembers': function(e) {
    e.preventDefault();
    Router.go('listMembers');
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
    Router.go('addCommunityEvents');
  }
});
