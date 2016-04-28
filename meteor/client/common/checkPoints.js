Template.checkPoints.onCreated(function() {
  //TODO: bit of a hack, basically this is re-used for the view member
  //profile template in super admin and the check points for a user
  var selector = {deleteInd: false}
  if(Router.current().params._id) {
    selector.userId = Router.current().params._id
  }   
  this.subscribe('transactions', selector);
});

Template.checkPoints.helpers({
  approvedEvents: function() {
    var transactions = Meteor.users.transactionsFor(this._id, true).fetch();
    return _.sortBy(transactions, function(transaction) {
                      return Date.parse(transaction.transactionDate);
                    }).reverse();
  },
  pendingEvents: function() {
    return Meteor.users.transactionsFor(this._id, false);
  },
  eventName: function(){
    var event = this.event;
    if(event) {
      return event.name;
    } else {
      return "";
    }
  },
  eventPoints: function(){
    var event = this.event;
    if(event) {
      if(event.isPointsPerHour) {
        return Math.round(event.pointsPerHour * this.hoursSpent) || '?';
      } else {
        return event.points;
      }
    } else {
      return "";
    }
  },
  totalPoints: function() {
    return Meteor.users.totalPointsFor(this._id);
  },
  
  rowBackgroundClass: function() {
    //some selfies don't have the adhoc flag for some reason... 
    var isAdhoc = _.isBoolean(this.event.adHoc) ? this.event.adHoc : true;
    return isAdhoc ? "selfie-event" : "member-event" ;  
  }
});
