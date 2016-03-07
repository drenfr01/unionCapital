//Used to hold organizations user wants to follow
FollowingOrganizations = new Meteor.Collection(null);

Template.collectUserDemographics.onCreated(function() {
  this.subscribe('eventCategories');
  this.subscribe('eventOrgs');
  this.subscribe('partnerOrganizations');
  this.subscribe('kids');
  this.subscribe('races');
  this.subscribe('ucbappaccess');
  this.subscribe('numberOfPeople');
  this.subscribe('partnerOrgSectors');
});

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

    userAttributes.profile.street1 = $('#street_number').val() + " " +
      $('#route').val();
    userAttributes.profile.street2 = $('#userStreetAddress2').val();
    userAttributes.profile.city = $('#locality').val();
    userAttributes.profile.state = $('#administrative_area_level_1').val();
    userAttributes.profile.zip = $('#postal_code').val();
    userAttributes.profile.partnerOrg = $('#organizations').val();
    userAttributes.profile.race = $("#races").val();
    userAttributes.profile.role = 'user';
    userAttributes.profile.followingOrgs = FollowingOrganizations.find().fetch();
    userAttributes.profile.gender = $("#genderForm input[type='radio']:checked").val();
    userAttributes.profile.UCBAppAccess = $('#device').val();

    Session.set('signupPage', 'eula');
  }
});
