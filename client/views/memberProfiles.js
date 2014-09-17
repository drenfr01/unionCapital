Template.memberProfiles.rendered = function() {
  $('#memberSearch').focus();
  Session.set("memberProfileSelected", false);
  Session.set('selectedMemberId', false);
};

Template.memberProfiles.helpers({  
  'currentMemberName': function() {
    memberId =  Session.get('currentMember');

    if(!_.isUndefined(memberId)) {
      return Meteor.users.findOne({_id: memberId}).fullName;
    }
    return '';
  },
  'member': function() {
    return Meteor.users.findOne(Session.get('selectedMemberId'));
  },
  'transactions': function() {
    return Meteor.users.transactionsFor(Session.get('selectedMemberId'), true);
  },
  'imageOf': function(imageId) {
    return Images.findOne(imageId).url();
  }
});

Template.memberProfiles.events({
  'keyup #memberSearch': function(e) {
    Session.set("searchQuery", e.currentTarget.value);
  },
  'click .memberNames': function(e) {
    Session.set('currentMember', this._id);
  },
  'click #addPoints': function(e) {
    var points = parseInt($('#pointsInput').val(),10);

    //TODO: have description for points
    var attributes = {
      userId: this._id,
      points: points,
      description: '' 
    };

    Meteor.call('addPointsToUser', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Added " + points + " points to user!");
      }
    });
  }
});

