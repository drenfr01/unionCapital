UI.registerHelper("activityOptions", function() {
  var events = Events.find().fetch();
  var names =  _.pluck(events, 'name');
  var options = [];
  _.each(names, function(name) {
    options.push({label: name, value: name});
  });
  return options;
});

AutoForm.addHooks('insertTransactionForm', {
  before: {
    insert: function(transaction) {
      transaction.userId = Meteor.userId();
      return transaction;
    }
  },
  onSuccess: function(){
    throwError('Points Added!', 'alert-success');
    Router.go('memberHomePage');
  }
});
