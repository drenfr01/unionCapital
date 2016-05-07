Meteor.publish('memberEngagement', function() {
  // TODO: Add security here
  // TODO: Limit the data sent up
  return MemberEngagementData.find({});
});
