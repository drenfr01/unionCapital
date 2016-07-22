var PartnerOrganizations = new Meteor.Collection(null);

Template.editMemberProfile.onCreated(function() {
  this.subscribe('eventCategories');
  this.subscribe('eventOrgs');
  this.subscribe('partnerOrganizations');
  this.subscribe('kids');
  this.subscribe('races');
  this.subscribe('ucbappaccess');
  this.subscribe('numberOfPeople');
  this.subscribe('partnerOrgSectors');
});

Template.editMemberProfile.onRendered(function() {
  PartnerOrganizations.remove({});
  var memberProfile = Meteor.user().profile;
  var insertPartner = function(partner) {
    PartnerOrganizations.insert({name: partner});
  };
  R.map(insertPartner, memberProfile.partnerOrg);
  $('#numberOfKids').val(memberProfile.numberOfKids);

  $("#device").val(memberProfile.UCBAppAccess);
  $("#genderForm input[id='" + memberProfile.gender+ "']").prop('checked', true);
  $("#medicaid input[id='" + memberProfile.medicaid+ "']").prop('checked', true);
  $("#reducedLunchForm input[id='" + memberProfile.reducedLunch + "']").prop('checked', true);
});


Template.editMemberProfile.helpers({
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
  member: function() {
    return Meteor.user();
  },
  memberEmail: function() {
    return Meteor.user().emails[0].address;
  },
  UCBAppAccess: function() {
    return UCBAppAccess.find();
  },
  partnerOrgs: function() {
    return PartnerOrganizations.find(); 
  },
  selectedRace: function(race) {
    return race === Meteor.user().profile.race ? 'selected' : '';
  }
});

Template.editMemberProfile.events({
  'change #organizations': function(e) {
    var partnerOrgDoc = PartnerOrgs.findOne({name: e.target.value});
    PartnerOrganizations.insert(partnerOrgDoc);
  },

  'click .removePartnerOrg': function(e) {
    PartnerOrganizations.remove(this._id); 
  },

  'click #submit': function(e) {
    e.preventDefault();
    var attributes = {
      email: $('#userEmail').val(),
      profile: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        street1: $('#street1').val(),
        street2: $('#street2').val(),
        city: $('#city').val(),
        state: $('#state').val(),
        zip: $('#zip').val(),
        partnerOrg: R.pluck('name', PartnerOrganizations.find().fetch())

      }
    };

    // Need to not set the value if not present to pass the check() function
    if($('#numberOfKids').val()) attributes.profile.numberOfKids = $('#numberOfKids').val();
    if($("#races").val()) attributes.profile.race = $("#races").val();
    if($("#medicaid input[type='radio']:checked").val()) attributes.profile.medicaid = $("#medicaid input[type='radio']:checked").val();
    if($("#genderForm input[type='radio']:checked").val()) attributes.profile.gender = $("#genderForm input[type='radio']:checked").val();
    if($("#reducedLunchForm input[type='radio']:checked").val()) attributes.profile.reducedLunch = $("#reducedLunchForm input[type='radio']:checked").val();
    if($('#device').val()) attributes.profile.UCBAppAccess = $('#device').val();

    Meteor.call('updateUser', attributes, function(error) {
      if(error) {
        sAlert.error(error.reason);
      } else {
        sAlert.success("Successfully Updated Account");
        Router.go('memberProfile');
      }
    });
  },
  'click #back': function(e) {
    e.preventDefault();
    Router.go('memberProfile');
  }
});
