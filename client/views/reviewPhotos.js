//TODO: this is all copy and pasted code from memberProfiles
//should abstract this to a single "search members" template
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

});

