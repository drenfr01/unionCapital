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

    //approved events
    if(ts.eventId) {
      ts.event = Events.findOne(ts.eventId);
    }

    //"selfie events"
    if(ts.pendingEventName) {
      var pendingEvent = {
        pendingEventName: ts.pendingEventName,
        pendingEventDescription: ts.pendingEventDescription,
        pendingEventDate: ts.pendingEventDate
      };
      ts.event = pendingEvent;
    }
  });
};

//TODO: as part of migration unset above fields

/*
Migrations.add({
  version: 2,
  name: "Denormalize all transactions",
  up: denormalizeTransaction,
  down: backwards2
});
*/
