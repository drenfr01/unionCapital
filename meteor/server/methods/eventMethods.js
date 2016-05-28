Meteor.methods({
  postFeedback: function(trans, feedbackContent, feedbackType) {
    check(trans, Object);
    check(feedbackContent, Match.OneOf(String, Number));
    check(feedbackType, String);

    var user = Meteor.users.findOne(this.userId);
    var event = trans.event;
    
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
    //assume user can only check into an event once
    //make sure that for this transaction they have not left feedback before
    //e.g. they left a rating before and now they're leaving a comment
    var containsFeedback = x => x.name === "Left Feedback"; 
    var feedback = R.filter(containsFeedback, trans.addons || [])
    if(R.isEmpty(feedback)) {
    
      var addOn = AddOns.findOne({name: 'Left Feedback'});
      DB.transactions.update(trans._id, {$push: addOn});
    }

    Events.update(event._id, {$push: {feedback: feedbackObject} });

  },

});
