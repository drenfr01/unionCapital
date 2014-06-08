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
    return Images.remove(imageId);
   },
   updateUserPoints: function(attributes) {
     return Meteor.users.update(attributes.userId, {$inc: { 'profile.points': attributes.points }});
   },
   insertTransaction: function(attributes) {
     check(attributes, {
       userId: Match.Optional(String),
       eventId: Match.Optional(String),
       imageId: Match.Optional(String),
       needsApproval: Match.Optional(Boolean),
       pendingEventName: Match.Optional(String),
       pendingEventDescription: Match.Optional(String)
     });
        
     return Transactions.insert(attributes);
   }
});
