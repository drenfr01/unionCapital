//TODO: toRadians and haversineFormula should be removed
//This is shared between client/server because I can't block on RPC calls client side, so
//need this to be here
//used in both geoLocate user in meteor.methods server side and helpers/shortestDistance on client side
function toRadians(x) {
     return x * (Math.PI / 180);
}

emailHelper = function(to, from, subject, text) {
      Email.send({
         to: to,
         from: from,
         subject: subject,
         text: text
      });
};

ServerHelpers = (function() {
  return {
    partnerAdminScope: function(userId) {
      var partnerAdmin = Meteor.users.findOne({_id: userId});
      
      //TODO: This will perform horribly at scale. Please refactor....
      var users = Meteor.users.find({"profile.partnerOrg": {$in: partnerAdmin.primaryPartnerOrg()}}, 
                                    {fields: {_id: 1}}).fetch();
      var usersArray = _.map(users, function(user) {
        return user._id;
      });
      var events = Events.find({institution: partnerAdmin.primaryPartnerOrg()}, 
                               {fields: {_id: 1}}).fetch();
      var eventsArray = _.map(events, function(event) {
        return event._id;
      });

      return {
        eventsArray: eventsArray,
        usersArray: usersArray
      };
    }
  };
}());
  

