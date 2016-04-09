DB = {
  removeTransaction: function(transactionId) {
    check(transactionId, String);
    Transactions.update(transactionId, {$set: {deleteInd: true}});

    var transaction = Transactions.findOne(transactionId);
    var user = Meteor.users.findOne(transaction.userId);

    // Recalculate points
    DB.calcPointsForUser(user._id);
  },

  // Inserts an ad hoc event
  // Will be expanded to cover all events
  // THIS MAY NEED ADDITIONAL WORK BEFORE GENERAL USE
  // HAS NOT BEEN TESTED
  insertEvent: function(attributes) {
    return Events.insert({
      name: attributes.eventName,
      address: attributes.eventAddress,
      description: attributes.eventName,
      category: attributes.category,
      active: attributes.active,
      adHoc: attributes.adHoc,
      eventDate: attributes.eventDate,
      endTime: attributes.endTime,
      duration: attributes.duration,
      points: attributes.points,
      isPointsPerHour: attributes.isPointsPerHour,
      latitude: attributes.userLat,
      longitude: attributes.userLng
    });
  },


  transactions: {
    insert: function(doc) {
      // Insert the transaction in question
      var result = Transactions.insert(doc);

      // Insert additional UCB button transaction
      if(doc.hasUCBButton) {
        var thisEvent = Events.findOne({name: 'UCB Button'});
        doc.event = thisEvent;
        doc.eventId = thisEvent._id;
        //note: admin will have to separately approve ucb button
        Transactions.insert(doc);
      }

      if (!result)
        throw new Meteor.Error('INSERT_FAILED', 'Failed to insert transaction');

      // Update user points
      DB.calcPointsForUser(doc.userId);

      return result;
    },

    update: function(transactionId, setDoc) {
      var result = Transactions.update(transactionId, setDoc);

      // Verfify result is not 0 items updated
      if (!result)
        throw new Meteor.Error('UPDATE_FAILURE', 'Transaction failed to update');

      // Update user points
      var transaction = Transactions.findOne(transactionId);
      var user = Meteor.users.findOne(transaction.userId);
      DB.calcPointsForUser(user._id);

      return result;
    },

    approve: function(transactionId, points) {
      var transaction = Transactions.findOne(transactionId);
      console.log(points);


      // Update the transaction to show approved
      // Adds the event id if non existed before
      var setDoc = { $set: { approved: true, approvalDate: Date(),'event.points': points} };
      DB.transactions.update(transactionId, setDoc);
    }
  },

  calcPointsForUser: function(userId) {
    if (!userId)
      throw new Meteor.Error('BAD_ID', 'No user found with this ID');

    var sum = 0;
    var approvedTransactions = Transactions.find({
      userId: userId,
      approved: true,
      event: { $exists: true },
      deleteInd: { $ne: true },
    });

    console.log(approvedTransactions);

    approvedTransactions.forEach(function(transaction) {
      var event = transaction.event;
      if(event && event.isPointsPerHour) {
        var val = Math.round(event.pointsPerHour * transaction.hoursSpent);
        sum += isNaN(val) ? 0 : val;
      } else if(event) {
        sum += isNaN(event.points) ? 0 : event.points;
      }
    });

    if (Meteor.users.findOne(userId).profile)
      Meteor.users.update(userId, { $set: {
        'profile.points': sum,
        'profile.pointsUpdatedTimestamp': new Date() }
      });

    return sum;
  },

  calcPointsForAllUsers: function() {
    var users = Meteor.users.find().fetch();

    _.each(users, function(user) {
      var userId = user._id;
      DB.calcPointsForUser(userId);
      // DB.calcPointsForUser(user._id);
    });
  },

  calcMostRecentTransaction: function(userId) {
    var pipeline = [
      { $match:
        {
          userId: userId,
          approved: true
        }
      },
      { $group:
        {
          _id: '$userId',
          maxDate: { $max: '$transactionDate' }
        }
      }
    ];

    // Grab the most recent
    var mostRecent = Transactions.aggregate(pipeline)[0].maxDate;

    // Update users collection
    Meteor.users.update(userId, { $set: { mostRecentTransaction: mostRecent } });

    return mostRecent;
  },


};
