var testwhitelist = new Mongo.Collection(null);
var isPrivateEvent = new ReactiveVar(false);

Template.privateEvents.onRendered(function() {
  this.subscribe('partnerOrganizations');
  this.subscribe('allUsers');
});

Template.privateEvents.helpers({
  isPrivateEvent: function() {
    if(isPrivateEvent.get() === 'true') {
      return true;
    } else {
      return false 
    }
  },

  //TODO: note to make this server side you have
  //to have the same arguments found here:
  //https://github.com/mizzao/meteor-autocomplete/blob/master/autocomplete-server.coffee
  //TODO: make sure fields are covered by index
  settings: function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
        token: '@',
        collection: UCBMembers,
        field: "profile.firstName",
        template: Template.userTemplate,
      },
      {
        token: '!',
        collection: PartnerOrgs,
        field: "name",
        options: '',
        template: Template.partnerOrgTemplate
      }
      ]
    };  
  },

  currentWhitelist: function() {
    return whitelist.find(); 
  },

  whitelistIdentifier: function() {
    if(this.profile) { //Members
      return this.profile.firstName + " " + this.profile.lastName;
    } else if (this.name) { //Partner Orgs
      return this.name; 
    } else {
      return "Unknown type of whitelist";
    }
  }
});

Template.privateEvents.events({
  'click #privateEvent': function(e) {
    isPrivateEvent.set(e.target.value);
  },

  "autocompleteselect input": function(event, template, doc) {
    whitelist.insert(doc);
    $('#msg').val('');
  },

  'click .glyphicon-remove': function(e) {
    whitelist.remove(this._id);
  }
});
