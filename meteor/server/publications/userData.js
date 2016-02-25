//note: this is only used in allMembers template
Meteor.publish('userData', function() {
  var user = Meteor.users.findOne({_id: this.userId});
  var userSelector = {};
  var userOptions = {};
  if (Roles.userIsInRole(this.userId, 'admin')) {
    //do nothing
  } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {
    userSelector = {"profile.partnerOrg": user.profile.partnerOrg, roles: 
      { $all: ['user'] }, deleteInd: false};
  } else if(this.userId) {
    userSelector = {_id: this.userId, deleteInd: false};
    userOptions = {fields: {'services.facebook.first_name': 1,
                              'services.facebook.last_name': 1,
                              'services.facebook.email': 1}};
  } else {
    this.ready();
  }
  var pipeline = [
    {$match: {approved: true, eventId: {$exists: true}}},
    {$sort: {transactionDate: -1}},
    {$group: 
      {
        _id: "$userId", 
        count: {$sum: 1},
        lastEvent: {$first: "$event"},
        lastTransactionDate: {$first: "$transactionDate"}
      }
    }
  ]
  var sums = Transactions.aggregate(pipeline);
  _.each(sums, function(sum) {
    Meteor.users.update(sum._id, 
                        {$set: 
                          {"profile.transCount": sum.count,
                            "profile.lastEventName": sum.lastEvent.name,
                            "profile.lastTransDate": sum.lastTransactionDate
                          }});
  });
  return Meteor.users.find(userSelector, userOptions);
});

