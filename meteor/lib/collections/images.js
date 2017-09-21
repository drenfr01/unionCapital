Slingshot.fileRestrictions("uploadUserPhoto", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

Images = new Mongo.Collection('images');
