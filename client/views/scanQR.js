UI.registerHelper("activityOptions", function() {
  var events = Events.find().fetch();
  var names =  _.pluck(events, 'name');
  var options = [];
  _.each(names, function(name) {
    options.push({label: name, value: name});
  });
  return options;
});

Template.scanQR.events({
  'submit': function(e) {
    var attributes = {
      points: parseInt($('#userPoints').val(), 10),
      userId:  Meteor.userId()
    };

    Meteor.call('updateUserPoints', attributes, function(error,response) {
      if(error) {
        throwError(error.reason, 'alert-danger');
        Router.go('scanQR');
      }
      throwError('Points Added!', 'alert-success');
      Router.go('memberHomePage');
    });
  }
});

AutoForm.addHooks('insertTransactionForm', {
  before: {
    insert: function(transaction) {
      transaction.userId = Meteor.userId();
      return transaction;
    }
  }
});
