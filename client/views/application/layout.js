Template.layout.events({
  'click #signOut': function(e) {
    Meteor.logout(function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        Router.go('landing');
      }
    });
  }
});
