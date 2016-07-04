addPrivateEventsFlag = function() {
  Events.update({}, {$set: {privateEvent: false}}, {multi: true});
}
