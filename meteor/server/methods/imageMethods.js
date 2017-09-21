Meteor.methods({
  insertImage: function(attributes) {
    return Images.insert(attributes);
  },

  updateImageWithUrl: function(attributes) {
    return Images.update({_id: attributes.imageId}, {$set: {imageUrl: attributes.imageUrl} });
  }
});