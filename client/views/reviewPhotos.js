Template.reviewPhotos.rendered = function() {
};

Template.reviewPhotos.helpers({  
  'pendingTransaction': function() {
  return Transactions.find( { needsApproval: true});
  },
  'modalData': function() {
    return Session.get('modalDataContext');
  },
  'imageUrl': function(imageId) {
    return Images.findOne(imageId).url();
  },
  'userName': function(userId) {
    console.log(Meteor.user());
    console.log(Meteor.users.find().fetch());
    var user = Meteor.users.findOne(userId);
    console.log(user);
    return user.profile.firstName + " " + user.profile.lastName;
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
    e.preventDefault();

    var attributes = {
      imageId: this.imageId,
      transactionId: this._id
    };

    Meteor.call('approveTransaction', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      }
      addSuccessMessage('Event submission approved');
    });
  }

});

