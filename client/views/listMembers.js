Session.setDefault('sortOn', 'firstName');
//1 = ascending, -1 = descending
Session.setDefault('sortOrder', 1);

Template.listMembers.helpers({
  'members': function() {
    var users =  Meteor.users.find().fetch();
    var tableRows = _.map(users, function(user) {
      var transactionCount = Transactions.find({userId: user._id}).count();
      var totalPoints = Meteor.users.totalPointsFor(user._id);
      var userProfile = user.profile || {firstName: 'admin', lastName: '', zip: ''};
      return {firstName: userProfile.firstName.toLowerCase() || "",
        lastName: userProfile.lastName.toLowerCase() || "", 
        zip: userProfile.zip || "",
        numberOfTransactions: transactionCount, 
        totalPoints: totalPoints};
    });
    var results = _.sortBy(tableRows, Session.get('sortOn'));
    // _.sortBy doesn't have a flag for ascending / descending
    // for some reason...
    if(Session.get('sortOrder') === 1) {
      return results;
    } else {
      return results.reverse();
    }
  }
});

Template.listMembers.events({
  'click #firstName': function(e) {
    Session.set('sortOn', 'firstName');
  },
  'click #zip': function(e) {
    Session.set('sortOn', 'zip');
  },
  'click #transactions': function(e) {
    Session.set('sortOn', 'numberOfTransactions');
  },
  'click #points': function(e) {
    Session.set('sortOn', 'totalPoints');
  },
  'change .radio-inline': function(e) {
    if(e.target.value === "ascending") {
      Session.set('sortOrder',1);
    } else {
      Session.set('sortOrder', -1);
    }
  }
});
