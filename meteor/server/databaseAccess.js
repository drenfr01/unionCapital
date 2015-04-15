removeTransaction = function(transactionId) {
  check(transactionId, String);
  Transactions.update(transactionId, {$set: {deleteInd: true}});
};

// Inserts an ad hoc event
// Will be expanded to cover all events
insertEvent = function(attributes) {
 return Events.insert(
   { name: attributes.eventName,
     address: attributes.eventAddress,
     description: attributes.eventName,
     active: 0,
     adHoc: true,
     startDate: attributes.eventDate,
     endDate: attributes.eventDate,
     points: attributes.points,
     isPointsPerHour: attributes.isPointsPerHour
   }
 );
};
