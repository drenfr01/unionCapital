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
    return {
      events: _.sortBy(transactions, function(transaction) {
                      return Date.parse(transaction.transactionDate);
                    }).reverse(),
      title: 'Approved events'
    };
  },
  pendingEvents: function() {
    return {
    events: Meteor.users.transactionsFor(this._id, false),
    title: 'Events waiting for approval'
    };
  },
  eventName: function(){
    var event = this.event;
    if(event) {
      return event.name;
    } else {
      return "";
    }
  },
  totalPoints: function() {
    return Meteor.users.totalPointsFor(this._id);
  },
  
});

Template.pointTemplate.events({
  'click .acidjs-rating-stars input': function(e) {
    console.log(e.target.value);
  },

  'click .post': function(e) {
    console.log($(e.target).parent().siblings().val());
  },
});

Template.pointTemplate.helpers({
  eventsToDisplay: function() {
    return this.events;
  },

  rowBackgroundClass: function() {
    return adhocStatus(this.event) ? "selfie-event" : "member-event";
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
  isUCBEvent: function() {
    return !adhocStatus(this.event);
  }
});

//some selfies don't have the adhoc flag for some reason... 
function adhocStatus(event) {
  return _.isBoolean(event.adHoc) ? this.event.adHoc : true;
}
