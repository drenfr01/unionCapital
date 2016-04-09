Template.imageViewer.rendered = function() {
  Session.set('searchString', null);
};

Template.imageViewer.onCreated(function() {
  this.subscribe('images');
});

Template.imageViewer.helpers({
  'images': function() {
    var userImages = Images.find().fetch();

    var fields = ['profile.firstName', 'profile.lastName', 'profile.partnerOrg'];
    // var userImages = Images.userMatches({ searchText: Session.get('searchString'), searchFields: fields, idField: 'userImage.metadata.userId' });

    //keeping reactivity by using function
    var users = _.map(userImages, function(userImage) {
      // Find a user that meets the searchText
      var user = Meteor.users.searchForOne({ _id: userImage.metadata.userId }, Session.get('searchString'), fields);

      if (!user) return;

      // Replacing the _id field in user to ensure uniqueness - meteor doesn't like it when there are duplicate _id keys
      _.extend(user, {
        _id: userImage._id,
        imageId: userImage._id,
        submissionTime: userImage.metadata.submissionTime
      });

      return user;
    });

    // Remove all nulls from the map process
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
  },

  'click #clearBtn': function() {
    Session.set('searchString', null);
    $('#search-box').val('');
    $('#search-box').focus();
  },
});
