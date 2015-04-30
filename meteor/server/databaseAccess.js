DB = {
  removeTransaction: function(transactionId) {
    check(transactionId, String);
    Transactions.update(transactionId, {$set: {deleteInd: true}});
  },

  // Inserts an ad hoc event
  // Will be expanded to cover all events
  insertEvent: function(attributes) {
    return Events.insert({
      name: attributes.eventName,
      address: attributes.eventAddress,
      description: attributes.eventName,
      category: attributes.category,
      active: 0,
      adHoc: true,
      eventDate: attributes.eventDate,
      endTime: addHours(moment(attributes.eventDate).toDate(), attributes.duration),
      duration: attributes.hoursSpent,
      points: attributes.points,
      isPointsPerHour: attributes.isPointsPerHour,
      latitude: attributes.userLat,
      longitude: attributes.userLng
    });
  }
};
