Template.collectUserDemographics.rendered = function() {
};

Template.collectUserDemographics.helpers({
  organizations: function() {
    return PartnerOrgs.find();
  },
  incomeBrackets: function() {
    return IncomeBrackets.find();
  },
  kids: function() {
    return Kids.find();
  },
  races: function() {
    return Races.find();
  }
});

Template.collectUserDemographics.events({
  'click #back': function(e) {
    Router.go('signup');
  },
  'click #submit': function(e) {
    e.preventDefault();

    var sessionProfile = Session.get("profile");

    var attributes = {
      email: sessionProfile.email,
      password: sessionProfile.password,
      profile: {
        firstName: sessionProfile.firstName,
        lastName: sessionProfile.lastName,
        street1: $('#street1').val(),
        street2: $('#street2').val(),
        city: $('#city').val(),
        state: $('#state').val(),
        zip: $('#zip').val(),
        partnerOrg: $('#organizations').val(),
        incomeBracket: $('#incomeBrackets').val(),
        numberOfKids: $('#numberOfKids').val(),
        race: $("#races").val(),
        role: 'user'
      }
    };
    //TODO: figure out if this can be done client side only?
    Meteor.call('createNewUser', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Successfully Created User");
        Meteor.loginWithPassword(attributes.email, attributes.password,
                                 function(error) {
                                   if(error) {
                                     addErrorMessage(error.reason);
                                     Router.go('landing');
                                   } else {
                                     Router.go('memberHomePage');
                                   }
                                 });
      }
    });
  }
});
