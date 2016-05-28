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
    Meteor.call('postFeedback', this, parseInt(e.target.value), AppConfig.feedbackType.rating,
      function(err, result) {
        if(err) {
          console.log(err)
        } else {
          //TODO: disable the stars in a persistent way
          $(e.target).siblings().prop('disabled', 'disabled');
          addSuccessMessage('Rated!');
        }
      });
  },

  'click .post': function(e) {
    Meteor.call('postFeedback', this, $(e.target).parent().siblings().val(), 
      AppConfig.feedbackType.comment, function(err, result) {
        if(err) {
          console.log(err);
        } else {
          addSuccessMessage('Posted!');
        }   
    });
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

    const sum = R.compose(
        R.reduce((acc, value) => acc + value, 0),
        R.map(R.prop('points')),
        R.defaultTo([])
      )(this.addons);

    var event = this.event;
    if(event && event.isPointsPerHour) {
      return sum + Math.round(event.pointsPerHour * this.hoursSpent) || '?';
    } else if (event && event.points){
      return sum + event.points;
    } else {
      return 'TBD'; 
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
