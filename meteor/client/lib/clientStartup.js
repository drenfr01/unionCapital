Meteor.startup(function() {
  //SAlert configuration
  sAlert.config({
    //to handle multiple approvals of transactions, etc.
    stack: {
      spacing: 10,
      limit: 3
    },
    onRouteClose: false,
    position: 'bottom',
  });
});
