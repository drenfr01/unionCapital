/* global Roles */
/* global MemberEngagementData */

Meteor.publish('memberEngagementData', function() {
  const user = Meteor.users.findOne({ _id: this.userId });

  if (Roles.userIsInRole(this.userId, 'admin')) {
    return MemberEngagementData.find({});
  }
  
  if (!!user && Roles.userIsInRole(this.userId, 'partnerAdmin')) {
    return MemberEngagementData.find({ _id: user.partnerOrg });
  }

  return this.ready();
});

Meteor.publish('allUsers', function() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return UCBMembers.find();
  } else {
    this.ready(); 
  }
});
