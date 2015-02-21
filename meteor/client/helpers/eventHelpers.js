getEvent = function(transaction){
  var id = transaction.eventId;
  var event = Events.findOne({ _id: id });
  return event;
};
