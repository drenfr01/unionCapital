Template.reviewPhotos.helpers({
  images: function(view) {
    return Images.find({}, 
      {sort: {updatedAt: -1}, limit: 3});
  }
});
