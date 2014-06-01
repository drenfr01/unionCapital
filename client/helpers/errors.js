Alerts = new Meteor.Collection(null);

addErrorMessage = function(message) {
  Alerts.insert({message: message, seen: false, type: 'alert-danger'});
};

addWarningMessage = function(message) {
  Alerts.insert({message: message, seen: false, type: 'alert-warning'});
};

addInfoMessage = function(message) {
  Alerts.insert({message: message, seen: false, type: 'alert-info'});
};

addSuccessMessage = function(message) {
  Alerts.insert({message: message, seen: false, type: 'alert-success'});
};

clearAlerts = function() {
  Alerts.remove({seen: true});
};
