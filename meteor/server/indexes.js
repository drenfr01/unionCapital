Meteor.startup(function() {
  Transactions._ensureIndex({ "userId": 1, "transactionDate": -1});
  Transactions._ensureIndex({ "eventId": 1  });
});
