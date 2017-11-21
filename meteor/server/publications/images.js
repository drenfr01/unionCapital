Slingshot.createDirective("uploadUserPhoto", Slingshot.S3Storage, {
  bucket: "unioncapitalprod",

  acl: "public-read",

  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {
    return Meteor.settings.env + "/" + file.name;
  }
});

Meteor.publish("memberImage", function() {
  return Images.find();
});
