Meteor.methods({
  createNewCustomer: function(attributes) {
    return addCustomer(attributes.firstName, attributes.lastName, attributes.email);
  },

  addMeasurements: function(attributes) {
    customerId = attributes.customerId;
    addMeasurementsToCustomer(customerId, attributes.measurements);
  },

  sendEmail: function(emailId) {
    // TODO: redo the check...
    //check([to, from, subject, text], [String]);

    //Throw error if fields are null

    //Let other method calls from same client start
    //running without waiting for email sending to
    //complete


    var email = Emails.findOne(emailId);
    Email.send(email);
   },
   buildEmailForReview: function(attributes) {
    return buildEmail(attributes.targetEmail, attributes.fromEmail, attributes.customerId, attributes.toBeOrderedArray);

  },
   createNewOrder: function(customerId) {
    return addOrder(customerId);
   },
   updateCurrentOrder: function(attributes) {
    return updateOrder(attributes.orderId,attributes.styleChoices);
   },
   removeImage: function(imageId) {
    return removeSingleImage(imageId);
   }
});
