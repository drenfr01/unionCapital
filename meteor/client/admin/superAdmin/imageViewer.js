Template.imageViewer.rendered = function() {
  Session.set('searchString', null);
};

Template.imageViewer.onCreated(function() {
  this.subscribe('images');
  this.subscribe('allUsers');
});

Template.imageViewer.helpers({
  'images': function() {
    // This needs pagination or it will try to return the whole images collection over time
    var userImages = Images.find({}, {sort: {inserted: -1 }}).fetch();


    var fields = ['profile.firstName', 'profile.lastName', 'profile.partnerOrg'];

    //keeping reactivity by using function
    var users = _.map(userImages, function(userImage) {
      // Find a user that meets the searchText
      var user = Meteor.users.findOne({ _id: userImage.userId })
      // TODO: I know I am breaking the searching here, but searchForOne is only used here and is giving me trouble
      //, Session.get('searchString'), fields);

      if (!user) return;

      // Replacing the _id field in user to ensure uniqueness - meteor doesn't like it when there are duplicate _id keys
      _.extend(user, {
        _id: userImage._id,
        imageId: userImage._id,
        imageUrl: userImage.imageUrl,
        submissionTime: userImage.inserted,
      });

      return user;
    });
console.log(users);
    // Remove all nulls from the map process
    users = _.filter(users, function(user) { return _.isObject(user);});
    return _.isEmpty(users) ? null : users;
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