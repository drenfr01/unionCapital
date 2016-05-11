Meteor.publish('singleUser', function(userId) {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find(userId);
  } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {
    //TODO: limit this to only their users?
    return Meteor.users.find(userId);
  } else {
    //TODO: should we limit this for a regular user or is that already
    //automatically published? (I think it is...)
    this.ready();
  }
});

Meteor.publish('allUsers', function() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return UCBMembers.find();
  } else {
    this.ready(); 
  }
});
