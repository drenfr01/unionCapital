//Used to hold organizations user wants to follow
FollowingOrganizations = new Meteor.Collection(null);

Template.collectUserDemographics.rendered = function() {
  // Define the object that directs the autofill targets
  // Keys should match up with field IDs

  var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'short_name',
    administrative_area_level_1: 'short_name',
    //country: 'long_name',
    postal_code: 'short_name'
  };

  addressAutocomplete.initialize('inputAddress', componentForm);
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
  },
  followingOrgs: function() {
    return FollowingOrganizations.find();
  },
  UCBAppAccess: function() {
    return UCBAppAccess.find();
  }
});

Template.collectUserDemographics.events({
  'change #followingOrgs': function(e) {
    FollowingOrganizations.upsert({description: e.target.value}, {description: e.target.value, 
        name: $("#followingOrgs option:selected").text()
    });
  },
  'click #back': function(e) {
    e.preventDefault();
    Session.set('signupPage', 'createNewUser');
  },
  'click .removeOrg': function(e) {
    FollowingOrganizations.remove(this._id);
  },
  'click #next': function(e) {
    e.preventDefault();

    userAttributes.profile.street1 = $('#street1').val();
    userAttributes.profile.street2 = $('#street2').val();
    userAttributes.profile.city = $('#city').val();
    userAttributes.profile.state = $('#state').val();
    userAttributes.profile.zip = $('#zip').val();
    userAttributes.profile.partnerOrg = $('#organizations').val();
    userAttributes.profile.numberOfKids = $('#numberOfKids').val();
    userAttributes.profile.race = $("#races").val();
    userAttributes.profile.role = 'user';
    userAttributes.profile.followingOrgs = FollowingOrganizations.find().fetch();
    userAttributes.profile.medicaid = $("#medicaid input[type='radio']:checked").val();
    userAttributes.profile.gender = $("#genderForm input[type='radio']:checked").val();
    userAttributes.profile.reducedLunch = $("#reducedLunchForm input[type='radio']:checked").val();
    userAttributes.profile.UCBAppAccess = $('#device').val();

    console.log(userAttributes);

    Session.set('signupPage', 'eula');
  }
});
