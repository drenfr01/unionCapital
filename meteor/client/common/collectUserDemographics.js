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
    e.preventDefault();
    Session.set('signupPage', 'createNewUser');
  },

  'click #next': function(e) {
    e.preventDefault();

    userAttributes.profile.street1 = $('#street1').val();
    userAttributes.profile.street2 = $('#street2').val();
    userAttributes.profile.city = $('#city').val();
    userAttributes.profile.state = $('#state').val();
    userAttributes.profile.zip = $('#zip').val();
    userAttributes.profile.partnerOrg = $('#organizations').val();
    userAttributes.profile.incomeBracket = $('#incomeBrackets').val();
    userAttributes.profile.numberOfKids = $('#numberOfKids').val();
    userAttributes.profile.race = $("#races").val();
    userAttributes.profile.role = 'user';

    Session.set('signupPage', 'eula');
  }
});
