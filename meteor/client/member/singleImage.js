Template.singleImage.onCreated(function() {
  console.log(this);
  this.subscribe('memberImage', this.data);
});

Template.singleImage.helpers({
  imageUrl: function() {
    return Images.findOne(Template.instance().data).url();
  }
});
