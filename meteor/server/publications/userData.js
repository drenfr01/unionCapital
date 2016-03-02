//note: this is only used in allMembers template
Meteor.publish('userData', function(skipCount, sortOn, sortOrder) {
  //TODO: make this a global?
  var positiveIntegerCheck = Match.Where(function(x) {
    check(x, Match.Integer);
    return x >= 0; 
  });

  check(skipCount, positiveIntegerCheck);
  check(sortOn, String);
  check(sortOrder, Match.Integer); //TODO: make this check for 1 or -1 explicitly

  var sortOrderInt = parseInt(sortOrder); 

  var user = Meteor.users.findOne({_id: this.userId});
  var userSelector = {};
  //TODO: there's a more elegant way to do this
  var sortOptions = {};
  sortOptions[sortOn] = sortOrderInt;
  var userOptions = {sort: sortOptions};
  if (Roles.userIsInRole(this.userId, 'admin')) {
    //do nothing
  } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {
    userSelector = {"profile.partnerOrg": user.profile.partnerOrg, roles: 
      { $all: ['user'] }, deleteInd: false};
  } else if(this.userId) {
    userSelector = {_id: this.userId, deleteInd: false};
    userOptions = _.extend(userOptions, {fields: {'services.facebook.first_name': 1,
                              'services.facebook.last_name': 1,
                              'services.facebook.email': 1}}
                          );
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
  //TODO make the below global
  userOptions = _.extend(userOptions, {
    limit: AppConfig.public.recordsPerPage, 
    skip: skipCount
  });

  Counts.publish(this, 'userCount', Meteor.users.find(), {
    noReady: true
  });
  return Meteor.users.find(userSelector, userOptions);
});

