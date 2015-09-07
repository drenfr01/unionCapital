/*
Find each event for a transaction, and then add it to the transaction field under the 
event property
*/


var denormalizeTransaction = function() {
  //Note: transactions without eventIDs are pending and not approved, so 
  //we'll just create an event one with the words pending without points  
  //we have to do this because pending name, etc. no longer exists
  
  Transactions.find().forEach(function(ts) {
    //TODO: removed fields pendingEventName, pendingEventDescription, pendingEventDate 

    var event = {};

    //approved events
    if(ts.eventId) {
      event = Events.findOne(ts.eventId);
    } else if (ts.pendingEventName) {
      event = {
        name: ts.pendingEventName,
        description: ts.pendingEventDescription,
        eventDate: ts.pendingEventDate
      };
    } else {
      //do nothing, something strange happened
      console.log("Already migrated: " + ts._id);
    }

    if(!_.isEmpty(event)) {
      Transactions.update(ts._id, {$set: {event: event }});
    } else {
      console.log("EMPTY!: " + ts._id);
    }
  });
};

//TODO: as part of migration unset above fields

var backwards2 = function() {
  console.log('No backwards migration, because we aint scared.');
};

Migrations.add({
  version: 2,
  name: "Denormalize all transactions",
  up: denormalizeTransaction,
  down: backwards2
});

Migrations.migrateTo('2,rerun');
