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
          addErrorMessage(error.reason);
          Router.go('customers');
        }

        Session.set("currentCustomer", customerId);
        Session.set("customerButtonClicked", false);
        $('#customerSearch').val("");
        Session.set('searchQuery', "");
      });
    } else {
      addErrorMessage("Duplicate Customer! Please enter a different name or use existing customer");
    }
  },
    'click #createNewUser': function(e) {
    e.preventDefault();

    var attributes = {
      email: $('#userEmail').val(),
      password: $('#userPassword').val(),
      profile: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        zip: $('#zip').val(),
      }
    };
    //TODO: figure out if this can be done client side only?
    Meteor.call('createNewUser', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Successfully Created User");
        e.preventDefault();
        prevValue = Session.get('memberButtonClicked');
        Session.set("memberButtonClicked",!prevValue);
      }
    });}

});
