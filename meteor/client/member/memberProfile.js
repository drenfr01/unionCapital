Template.memberProfile.helpers({
  memberProfile: function() {
    return Meteor.user().profile;
  },
  memberPhoto: function() {
    //TODO: this is insecure, need to set the access functions
    return MemberProfilePhotos.find();
  }
});

Template.memberProfile.events({
  'change #profilePhoto': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      var newFile = new FS.File(file);
      newFile.metadata = {userId: Meteor.userId(), timestamp: moment().toDate()};
      MemberProfilePhotos.insert(newFile, function(err, fileObj) {

      });
    });
  }
});
