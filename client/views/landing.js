Template.landing.currentCustomerName = function() {
  customerId =  Session.get('currentCustomer');

  if(!_.isUndefined(customerId)) {
    return Customers.findOne({_id: customerId}).fullName;
  }
  return '';
};
Template.landing.events({
  'keyup #customerSearch': function(e) {
    Session.set("searchQuery", e.currentTarget.value);
  }
});

Template.landing.rendered = function() {
  $('#customerSearch').focus();
};

Template.landing.events({
  'click #addCustomer': function(e) {
    e.preventDefault();
    prevValue = Session.get('customerButtonClicked');
    Session.set("customerButtonClicked",!prevValue);
  },
  'click #newItem': function(e) {
    e.preventDefault();

    cId = Session.get('currentCustomer');

    Meteor.call('createNewOrder', cId, function(error, orderId) {
      if(error) {
        throwError(error.reason, "alert-danger");
        Router.go('landing');
      }
      Session.set('itemId', orderId);
      Router.go('itemMenu');
    });
  }
});

Template.landing.events({
  'click .customerNames': function(e) {
    Session.set('currentCustomer', this._id);
  }
});
