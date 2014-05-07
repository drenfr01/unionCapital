Errors = new Meteor.Collection(null);

throwError = function(message, type) {
  Errors.insert({message: message, seen: false, type: type});
};
clearErrors = function() {
  Errors.remove({seen: true});
};
