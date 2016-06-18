//Used to hold organizations user wants to follow
var PartnerOrganizations = new Meteor.Collection(null);

Template.collectUserDemographics.onCreated(function() {
  PartnerOrganizations.remove({});
  this.subscribe('eventCategories');
  this.subscribe('eventOrgs');
  this.subscribe('partnerOrganizations');
  this.subscribe('races');
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
  partnerOrgs: function(e) {
    return PartnerOrganizations.find(); 
  },
});

Template.collectUserDemographics.events({
  'change #organizations': function(e) {
    var partnerOrgDoc = PartnerOrgs.findOne({name: e.target.value});
    PartnerOrganizations.insert(partnerOrgDoc);
  },

  'click .removePartnerOrg': function(e) {
    PartnerOrganizations.remove(this._id); 
  },

  'click #back': function(e) {
    e.preventDefault();
    Session.set('signupPage', 'createNewUser');
  },

  'click #next': function(e) {
    e.preventDefault();

    userAttributes.profile.street1 = $('#street_number').val() + " " +
      $('#route').val();
    userAttributes.profile.street2 = $('#userStreetAddress2').val();
    userAttributes.profile.city = $('#locality').val();
    userAttributes.profile.state = $('#administrative_area_level_1').val();
    userAttributes.profile.zip = $('#postal_code').val();
    userAttributes.profile.partnerOrg = 
      R.pluck('name', PartnerOrganizations.find().fetch());
    userAttributes.profile.race = $("#races").val();
    userAttributes.profile.role = 'user';
    userAttributes.profile.gender = 
      $("#genderForm input[type='radio']:checked").val();

    $("#userAddressForm").validate({
      highlight: function(element, errorClass) {
        $(element).fadeOut(function() {
          $(element).fadeIn();
        });
      },
      rules: {
        street_number: {
          required: true,
          digits: true
        },
        street: {
          required: true
        },
        city: {
          required: true
        },
        state: {
          required: true,
          rangelength: [2,2] //only accept two digit state abbreviations
        },
        postal_code: {
          required: true,
          digits: true,
          rangelength: [5,5]
        },
      }
    });
    var isValid = $('#userAddressForm').valid();

    if(isValid) {
      Session.set('signupPage', 'eula');
    } else {
      addErrorMessage('Please correct fields');
    }
  }
});
