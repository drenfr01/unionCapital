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
    console.log(feedbackId);
    //assume user can only check into an event once
    //make sure that for this transaction they have not left feedback before
    //e.g. they left a rating before and now they're leaving a comment
    var feedbackAddonName = "Left Feedback";
    var containsFeedback = x => x.name === feedbackAddonName; 
    var feedback = R.filter(containsFeedback, trans.addons || [])
    if(R.isEmpty(feedback)) {
    
      var addOn = Addons.findOne({name: feedbackAddonName});
      if(addOn) { 
        //note: this db layer auto-recalculates points
        DB.transactions.update(trans._id, {$push: {addons: addOn}});
      } else {
        throw new Meteor.Error('Addon_Not_Found', 
          'This addon was not found, make sure fixture data is present?');
      }
    }

    Events.update(event._id, {$push: {feedback: feedbackObject} });

  },

});
