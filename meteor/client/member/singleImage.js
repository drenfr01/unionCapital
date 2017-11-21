Template.singleImage.onCreated(function() {
  this.subscribe('memberImage', this.data);
});

Template.singleImage.helpers({
  imageUrl: function() {
    return Images.findOne({_id: Template.instance().data}).imageUrl;
  }
});
