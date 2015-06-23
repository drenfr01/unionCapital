Alerts = new Meteor.Collection(null);

addErrorMessage = function(message) {
  Alerts.insert({message: message, seen: false, type: 'alert-danger'});
  window.scrollTo(0,0);
};

addWarningMessage = function(message) {
  Alerts.insert({message: message, seen: false, type: 'alert-warning'});
  window.scrollTo(0,0);
};

addInfoMessage = function(message) {
  Alerts.insert({message: message, seen: false, type: 'alert-info'});
  window.scrollTo(0,0);
};

addSuccessMessage = function(message) {
  Alerts.insert({message: message, seen: false, type: 'alert-success'});
  window.scrollTo(0,0);
};

