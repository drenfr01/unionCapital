Template.facebookLogin.helpers({
  'firstName': function() {
    return  Meteor.user().profile.name.split(" ").shift();
  },
  'lastName': function() {
    return  Meteor.user().profile.name.split(" ").pop();
  }
});
Template.facebookLogin.events({
  'click #addInformation': function(e){
    e.preventDefault();

    var attributes = {
      userId: Meteor.userId(),
      email: $('#userEmail').val(),
      profile: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        zip: $('#zip').val()
      }
    };
    //TODO: figure out if this can be done client side only?
    Meteor.call('updateUserProfile', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Thanks for updating your profile");
        Router.go('memberHomePage');
      }
    });
  }
});
