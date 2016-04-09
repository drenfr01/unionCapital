//Partner Admins can only see images from their users
Meteor.publish('images', function() {
  var user = Meteor.users.findOne({_id: this.userId});

  if (Roles.userIsInRole(this.userId, 'admin')) {

    return Images.find();

  } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {

    var users = Meteor.users.find({ 'profile.partnerOrg': user.profile.partnerOrg }).fetch();
    return Images.find({ 'metadata.userId': { $in: users }});

  } else if(this.userId) {

    return Images.find({ 'metadata.userId': this.userId });

  } else {
    this.ready();
  }
});

Meteor.publish('singleImage', function(userId) {
  check(userId, String);
  if (Roles.userIsInRole(this.userId, 'admin')) {

    return Images.find({'metadata.userId': userId});

  } else {
    this.ready();
  }

});
