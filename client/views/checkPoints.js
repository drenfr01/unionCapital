Template.checkPoints.helpers({
  approvedEvents: function() {
    return Meteor.users.transactionsFor(this._id, false);
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
        return Math.round(event.pointsPerHour * totalHours(this.hoursSpent,this.minutesSpent));
      } else {
        return event.points;
      }
    } else {
      return "";
    }
  },
  eventStart: function(){
    var event = getEvent(this);
    if(event) {
      return event.startDate;
    } else {
      return "";
    }
  },
  eventEnd: function(){
    var event = getEvent(this);
    if(event) {
      return event.endDate;
    } else {
      return "";
    }
  },
  totalPoints: function() {
    return Meteor.users.totalPointsFor(this._id);
  }
});
