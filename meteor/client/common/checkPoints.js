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
          sAlert.success('Rated!');
        }
      });
  },

  'click .post': function(e) {
    Meteor.call('postFeedback', this, $(e.target).parent().siblings().val(), 
      AppConfig.feedbackType.comment, function(err, result) {
        if(err) {
          console.log(err);
        } else {
          sAlert.success('Posted!');
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
    return GlobalHelpers.eventPoints(this);
  },

  isUCBEvent: function() {
    return !adhocStatus(this.event);
  },

  hasImage: function() {
    return this.imageId ? true : false;
  },

  eventName: function(){
    var event = this.event;
    console.log(event);
    if(event._id) {
      return "You earned points for: " + event.name;
    } else if (event.eventType == AppConfig.selfieEvent){
      return "You earned a selfie star for: " + event.category;
    } else {
      return "You earned points for: "  + event.category;
    }
  },
});

//TODO: selfies do not have an adhoc flag, only pre-listed events
function adhocStatus(event) {
  return _.isBoolean(event.adHoc) ? this.event.adHoc : true;
}
