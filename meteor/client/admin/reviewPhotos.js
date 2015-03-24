Template.reviewPhotos.rendered = function() {
};

Template.reviewPhotos.helpers({  
  'pendingTransaction': function() {
  return Transactions.find( { needsApproval: true});
  },
  'modalData': function() {
    return Session.get('modalDataContext');
  },
  'approvalModalData': function() {
    return Session.get('approvalModalDataContext');
  },
  'imageUrl': function(imageId) {
    if(Images.findOne(imageId)) {
      return Images.findOne(imageId).url();
    }
  },
  'userName': function(userId) {
    var user = Meteor.users.findOne(userId);
    //Handling delay in loading collections
    if(user) {
      return user.profile.firstName + " " + user.profile.lastName;
    }
  },
  'getPoints': function(eventId) {
    var event = Events.findOne(eventId);
    if(event.isPointsPerHour) {
      return event.pointsPerHour * this.hoursSpent;
    } else {
      return event.points;
    }
  }
});

Template.reviewPhotos.events({
  'click .showImage': function(e) {
    Session.set('modalDataContext', this);
  },
  'click .rejectEvent': function(e) {
    e.preventDefault();

    var attributes = {
      imageId: this.imageId,
      transactionId: this._id 
    };

    Meteor.call('rejectTransaction', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      }
      Router.go('reviewPhotos');
    });
  },
  'click .approveEvent': function(e) {
    Session.set('approvalModalDataContext', this);
  },
  'click #sendApproval': function(e) {

    var attributes = {
      transactionId: this._id,
      userId: this.userId,
      eventId: this.eventId,
      imageId: this.imageId,
      eventName: this.pendingEventName,
      eventAddress: "temporary",
      eventDescription: this.pendingEventDescription,
      eventDate: new Date(this.transactionDate),
      points: parseInt($("#pointsInput").val())
    };

    Meteor.call('approveTransaction', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage('Event submission approved');
      }
    });
  }

});

