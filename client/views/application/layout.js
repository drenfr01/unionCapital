Template.layout.currentCustomerName = function() {
  customerId =  Session.get('currentCustomer');

  if(!_.isUndefined(customerId) && Customers.findOne({_id: customerId})) {
    return Customers.findOne({_id: customerId}).fullName;
  }
  return '';
};
Template.layout.events({
  'keyup #customerSearch': function(e) {
    Session.set("searchQuery", e.currentTarget.value);
  }
});

Template.layout.rendered = function() {
  $('#customerSearch').focus();
};

Template.layout.events({
  'click #addCustomer': function(e) {
    e.preventDefault();
    prevValue = Session.get('customerButtonClicked')
    Session.set("customerButtonClicked",!prevValue);
  }
});

Template.layout.events({
  'click .customerNames': function(e) {
    Session.set('currentCustomer', this._id);
  }
});
