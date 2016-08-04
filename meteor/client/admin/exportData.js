var base64ToBlob = function(base64String) {
  var blob, byteArray, byteCharacters, byteNumbers, i;
  byteCharacters = atob(base64String);
  byteNumbers = new Array(byteCharacters.length);
  i = 0;
  while (i < byteCharacters.length) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
    i++;
  }
  byteArray = new Uint8Array(byteNumbers);
  return blob = new Blob([byteArray], {
    type: "zip"
  });
};

Template.exportData.onRendered(function() {
  this.subscribe('partnerOrganizations');
});

Template.exportData.helpers({
  partnerOrgs: function() {
    return PartnerOrgs.find({});
  },
});

Template.exportData.events({
  'click #exportUserData': function(e) {
    e.preventDefault();
    const partnerOrg = $('#org-select').val();
    Meteor.call('exportUserData', partnerOrg, function(error, response) {
      if(error) {
        console.log(error.reason);
      } else {
        var blob = base64ToBlob(response);
        saveAs(blob, 'user_data.zip');
      }
    });
  },

  'click #exportMembers': function(e) {
    e.preventDefault();
    var userId = Meteor.userId();
    Meteor.call('exportMembers', userId, function(error, response) {
      if(error) {
        console.log(error.reason);
      } else {
        var blob = base64ToBlob(response);
        saveAs(blob, 'members.zip');
      }
    });
  },
  'click #exportPartnerOrgs': function(e) {
    e.preventDefault();
    var userId = Meteor.userId();
    Meteor.call('exportPartnerOrgs', userId, function(error, response) {
      if(error) {
        console.log(error.reason);
      } else {
        var blob = base64ToBlob(response);
        saveAs(blob, 'partnerOrgs.zip');
      }
    });
  },
  'click #exportEvents': function(e) {
    e.preventDefault();
    var userId = Meteor.userId();
    Meteor.call('exportEvents', userId, function(error, response) {
      if(error) {
        console.log(error.reason);
      } else {
        var blob = base64ToBlob(response);
        saveAs(blob, 'events.zip');
      }
    });
  }
});
