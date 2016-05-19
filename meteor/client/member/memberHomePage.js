Template.memberHomePage.onCreated(function() {
  this.subscribe('transactions', {deleteInd: false, approved: true}, {limit: 5});
});

Template.memberHomePage.helpers({

  'currentMemberName': function() {
    if(Meteor.user() && Meteor.user().profile) {
      return Meteor.user().profile.firstName || "";
    } else {
      return "";
    }
  },

  totalPoints: function() {
    if (Meteor.user())
      return Meteor.user().profile.points || 0;
    else
      return 'Loading...';
  },

  'approvedPoints': function() {
    return Transactions.find();  
  },
});
