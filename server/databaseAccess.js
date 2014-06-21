removeTransaction = function(transactionId) {
  check(transactionId, String);
  Transactions.update(transactionId, {$set: {needsApproval: false}});
};
insertEvent = function(attributes) {
 return Events.insert(
   { name: attributes.eventName,
     address: attributes.eventAddress,
     description: attributes.eventName,
     active: 0,
     startDate: attributes.eventDate,
     endDate: attributes.eventDate,
     points: attributes.points
   }
 );  
};
