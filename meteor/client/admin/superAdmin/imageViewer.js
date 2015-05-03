Template.imageViewer.helpers({
  'images': function() {
    var selector = Session.get('selector');
    if(Session.get('selector')) {
      selector = Session.get('selector');
    }
    var userImages = Images.find().fetch();
    return _.map(userImages, function(userImage) {
      var user = Meteor.users.findOne(userImage.metadata.userId);
      _.extend(user, {
        imageId: userImage._id
      });
      return user;
    });

  },
  'imageUrl': function(imageId) {
    if(Images.findOne(imageId)) {
      return Images.findOne(imageId).url();
    }
  },
  'modalData': function() {
    return Session.get('modalDataContext');
  }
});

Template.imageViewer.events({
  'click .showImage': function(e) {
    Session.set('modalDataContext', this);
  }
});
