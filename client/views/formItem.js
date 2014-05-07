Template.formItem.customerMeasurement = function(item) {
  customerId = Session.get('currentCustomer');

  customerMeasurements = Customers.findOne({_id: customerId}).measurements;
  if(!_.isUndefined(customerMeasurements)) {
    return 'Currently: ' + customerMeasurements[item]
  }
  return 'No Measurement Taken Yet'
}