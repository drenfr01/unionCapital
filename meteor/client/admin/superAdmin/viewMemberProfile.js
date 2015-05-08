Template.viewMemberProfile.helpers({
  member: function() {
    return this;
  },
  isArchived: function() {
    return Meteor.users.findOne(this._id).deleteInd;
  }
});

Template.viewMemberProfile.events({
  'submit form': function(e) {
    e.preventDefault();

    var points = parseInt(e.target.points.value,10);
    var description = e.target.description.value;

    //TODO: have description for points
    var attributes = {
      userId: this._id,
      points: points,
      description: description,
    };

    Meteor.call('addPointsToUser', attributes, function(error) {
      if(error) {
        console.log(error.reason);
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Added " + points + " points to user!");
      }
    });
  },
  'click #archiveMember': function(e) {
    Meteor.call('archiveMember',this._id, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Archived member");
      }
    });
  },
  'click #unarchiveMember': function(e) {
    e.preventDefault()
    Meteor.call('unarchiveMember',this._id, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Unarchived member");
      }
    })
  }
});
