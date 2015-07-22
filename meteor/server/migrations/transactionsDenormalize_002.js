/*
transactions:
  eventName: pendingEventName,
  eventDescription: pendingEventDescriptions,
  eventDate: pendingEventDate
  eventAddress: Events.findOne...,
  approvalDate: Events.findOne...,
  points: function1()
*/

// Should denormalize points into transactions
function function1() {
  var trans = Transactions.find();

  trans.forEach(function(transaction) {
    var event = Transactions.eventFor(transaction);

    if(event && event.isPointsPerHour) {
      sum = Math.round(sum + (event.pointsPerHour * transaction.hoursSpent));
    } else if(event) {
      sum += event.points;
    }
  });
}

var denormalizeTransaction = function() {
  //certain events don't have event ids, have to figure out if that's important
  //or not. And if so, how to migrate them
  Transactions.find().forEach(function(user) {
      
  });
};

/*
Migrations.add({
  version: 2,
  name: "Denormalize all transactions",
  up: denormalizeTransaction,
  down: backwards2
});
*/
