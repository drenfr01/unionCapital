Template.addPartnerAdminUser.helpers({
  organizations: function() {
    return PartnerOrgs.find();
  },
});

Template.addPartnerAdminUser.events({
  'click #back': function(e) {
    Router.go('partnerAdminView');
  },
  'click #submit': function(e) {
    e.preventDefault();

    var sessionProfile = Session.get("profile");

    var attributes = {
      email: $('#userEmail').val(),
      password: $('#userPassword').val(),
      profile: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        street1: $('#street1').val(),
        street2: $('#street2').val(),
        city: $('#city').val(),
        state: $('#state').val(),
        zip: $('#zip').val(),
        partnerOrg: $('#organizations').val(),
        role: 'partnerAdmin'
      }
    };
    Meteor.call('createNewUser', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Successfully Created User");
        Router.go('partnerAdminView');
      }
    });
  }
});
