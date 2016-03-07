Meteor.publish('partnerAdminUsers', function() {
  if(Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find({roles: {$in: ['partnerAdmin'] }});
  } else {
    return this.ready();
  }
});
