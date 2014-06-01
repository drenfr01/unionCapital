Template.adminEventSummary.helpers({
  'visitors': function() {
    return Transactions.find({ eventID: "ObjectID(\"" + this._id + "\")" }).map(function(t) {
      return Meteor.users.find({ _id: t.userId });
    });
  }
});
