Template.imageViewer.rendered = function() {
  Session.set('searchString', null);
};

Template.imageViewer.helpers({
  'images': function() {
    var userImages = Images.find().fetch();
    //keeping reactivity by using function
    var searchString = function() { return Session.get('searchString'); }();
    var users = _.map(userImages, function(userImage) {
      var user = Meteor.users.findOne(userImage.metadata.userId);
      _.extend(user, {
        imageId: userImage._id,
        submissionTime: userImage.metadata.submissionTime
      });
      //
      if(_.isString(searchString)) {
        if (user.profile.firstName.indexOf(searchString) > -1  ||
            user.profile.lastName.indexOf(searchString) > -1 || 
              user.profile.partnerOrg.indexOf(searchString) > -1
           ) {
             return user; //user matches search box string
           } else {
             return; //user does not match search box string
           }
      } else {  //nothing in search box, return all users
        return user;
      }

    });
    users = _.filter(users, function(user) { return _.isObject(user);});
    return _.isEmpty(users) ? null : users;
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
  },
  'keyup #search-box': function(e) {
    Session.set('searchString', $('#search-box').val());
  }
});
