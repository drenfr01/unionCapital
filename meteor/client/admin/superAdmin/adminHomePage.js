Template.adminHomePage.events({
  'click #allMembers': function(e) {
    e.preventDefault();
    Router.go('allMembers', {page: 1});
  },
  'click #partnerOrgs': function(e) {
    e.preventDefault();
    Router.go('partnerOrgs');
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
