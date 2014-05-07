Template.addCustomerForm.events({
  'click #createNewCustomer': function(e) {
    e.preventDefault();

    //TODO: if we limit publication of customers, we'll need to make
    //this a server side method call

    var email = $('#emailInput').val();
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();

    var duplicateCustomer = Customers.findOne(
      {firstName: firstName, 
       lastName: lastName
      });

    if(_.isUndefined(duplicateCustomer)) {
      
      var attributes = {
        email: email,
        firstName: firstName,
        lastName: lastName
      };
      Meteor.call('createNewCustomer', attributes,
        function(error, customerId) {
        if (error) {
          throwError(error.reason);
          Router.go('customers');
        }

        Session.set("currentCustomer", customerId);
        Session.set("customerButtonClicked", false);
        $('#customerSearch').val("");
        Session.set('searchQuery', "");
      });
    } else {
      throwError("Duplicate Customer! Please enter a different name or use existing customer",
          "alert-danger");
    }
  }
});
