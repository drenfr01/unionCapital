Template.memberProfiles.rendered = function() {
  $('#memberSearch').focus();
};

Template.memberProfiles.helpers({  
  'currentMemberName': function() {
    memberId =  Session.get('currentMember');

    if(!_.isUndefined(memberId)) {
      return Meteor.users.findOne({_id: memberId}).fullName;
    }
    return '';
  }
});

Template.memberProfiles.events({
  'keyup #memberSearch': function(e) {
    Session.set("searchQuery", e.currentTarget.value);
  },
  'click #addMember': function(e) {
    e.preventDefault();
    prevValue = Session.get('memberButtonClicked');
    Session.set("memberButtonClicked",!prevValue);
  },
  'click .memberNames': function(e) {
    Session.set('currentMember', this._id);
  }
});

