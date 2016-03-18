// FS.debug = true;

// var imageStore = new FS.Store.S3("images", {
//   bucket: "unioncapitalprod",
//   folder: Meteor.settings.folder,
//   accessKeyId: Meteor.settings.AWS_ACCESS_KEY_ID,
//   secretAccessKey: Meteor.settings.AWS_SECRET_ACCESS_KEY
// });

// Images = new FS.Collection("images", {
//   stores: [imageStore]
// });


// //TODO: obviously change trivially true return when we implement user login
// Images.allow({
//   insert: function(userId, doc) {
//     return true;
//   },
//   update: function(userId, doc, fieldNames, modifier) {
//     return true;
//   },
//   remove: function(userId, doc) {
//     return true;
//   },
//   download: function(userId, doc) {
//     return true;
//   }
// });
