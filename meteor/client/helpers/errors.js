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
  var id = Alerts.insert({message: message, seen: false, type: 'alert-success'});
  setTimeout(function() {
    Alerts.remove(id);
  }, AppConfig.alerts.successTimeout);
};

