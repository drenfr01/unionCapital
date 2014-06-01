Template.review.emailText = function() {
  var email = Emails.findOne(Session.get('emailId'));
  return email.safeHtml;
};

Template.review.events({
  'click #sendEmail': function(e) {
    e.preventDefault();
    //Grab user input

    //the empty string "", undefined, and null are all falsy
    Meteor.call('sendEmail', Session.get('emailId'),
        function(error) {
          if(error) {
            addErrorMessage(error.reason);
            Router.go('landing');
          }
          Router.go('landing');
          addErrorMessage("Order sent successfully");
      });
  },
});
