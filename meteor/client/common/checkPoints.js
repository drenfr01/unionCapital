Template.checkPoints.helpers({
  approvedEvents: function() {
    var transactions = Meteor.users.transactionsFor(this._id, false).fetch();
    return _.sortBy(transactions, function(transaction) {
                      return Date.parse(transaction.transactionDate);
                    }).reverse();
  },
  pendingEvents: function() {
    return Meteor.users.transactionsFor(this._id, true);
  },
  eventName: function(){
    var event = getEvent(this);
    if(event) {
      return event.name;
    } else {
      return "";
    }
  },
  eventPoints: function(){
    var event = getEvent(this);
    if(event) {
      if(event.isPointsPerHour) {
        return Math.round(event.pointsPerHour * this.hoursSpent);
      } else {
        return event.points;
      }
    } else {
      return "";
    }
  },
  totalPoints: function() {
    return Meteor.users.totalPointsFor(this._id);
  }
});
