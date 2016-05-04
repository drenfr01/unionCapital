/* global FS */
/* global Images */

FS.debug = false;

if (Meteor.settings.env !== 'dev') {
  var imageStore = new FS.Store.S3("images", {
    bucket: "unioncapitalprod",
    folder: Meteor.settings.folder,
    accessKeyId: Meteor.settings.AWS_ACCESS_KEY_ID,
    secretAccessKey: Meteor.settings.AWS_SECRET_ACCESS_KEY,
  });

  Images = new FS.Collection("images", {
    stores: [imageStore],
  });

  //TODO: obviously change trivially true return when we implement user login
  Images.allow({
    insert: function() {
      return true;
    },
    update: function() {
      return true;
    },
    remove: function() {
      return true;
    },
    download: function() {
      return true;
    },
  });
}
