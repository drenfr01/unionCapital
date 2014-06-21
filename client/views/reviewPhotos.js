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
    //Handling delay in loading collections
    if(Meteor.users.findOne(userId)) {
      var user = Meteor.users.findOne(userId);
      return user.profile.firstName + " " + user.profile.lastName;
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
      }
      addSuccessMessage('Event submission approved');
    });
  }

});

