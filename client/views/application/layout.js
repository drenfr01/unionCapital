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

Template.layout.events({
  'click .customerNames': function(e) {
    Session.set('currentCustomer', this._id);
  }
});


/* doesn't work*/

Template.layout.events({
  'click .logout': function(e) {
    Meteor.logout(callback);
  }
});




Template.layout.events({
  'click #disapear': function(e) {
    $('.nav').empty();

  }
});








