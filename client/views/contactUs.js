Template.contactUs.events({
  'click #submit': function(e) {
    e.preventDefault();

    var attributes = {
      userId: Meteor.userId(),
      comment: $('#userComment').val()
    };
    
    Meteor.call('sendEmail', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
        Router.go('memberHomePage');
      } else {
        addSuccessMessage("Your comment is on the way! We'll get back to you shortly!");
        Router.go('memberHomePage');
      } 
    });
  }
});
