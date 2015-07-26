var imageStore = new FS.Store.S3("images");

Images = new FS.Collection("images", {
  stores: [imageStore]
});


