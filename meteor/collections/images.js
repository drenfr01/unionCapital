Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {path: '/Users/duncanrenfrow-symon/Documents/Meteor_App/apparel/uploads', maxTries:10})]
});
FS.debug = false;

//TODO: obviously change trivially true return when we implement user login
Images.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  },
  download: function(userId, doc) {
    return true;
  }
});
