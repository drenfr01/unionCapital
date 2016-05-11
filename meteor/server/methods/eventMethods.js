Meteor.methods({
  postFeedback: function(event, feedbackContent, feedbackType) {
    check(event, Object);
    check(feedbackContent, Match.OneOf(String, Number));
    check(feedbackType, String);

    var user = Meteor.users.findOne(this.userId);
    
    //Note: type is an Enum
    const feedbackObject = {
      feedbackContent: feedbackContent,
      feedbackType: feedbackType,
      userId: this.userId,
      userName: user.profile.firstName + ' ' + user.profile.lastName,
      feedbackTimestamp: Date.now(),
      eventId: event._id,
      eventName: event.name,
      eventInstitution: event.institution,
      deleteInd: false
    };

    const feedbackId = Feedback.insert(feedbackObject);
    Events.update(event._id, {$push: {feedback: feedbackObject} });

  },

});
