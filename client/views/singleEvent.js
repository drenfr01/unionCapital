Session.setDefault('rsvpList', null);

Template.singleEvent.rendered = function() {
  Meteor.call('getRsvpList', this.data._id, function(error, data) {
    if(error) {
      addErrorMessage(error.reason);
    } else {
      Session.set('rsvpList',data);
    }
  });
};
Template.singleEvent.helpers({
  'rsvpList': function() {
    return Session.get('rsvpList');
  },
  'totalReservations': function() {
    return _.reduce(Session.get('rsvpList'), function(sum, reservation) { 
      return sum + reservation.numberOfPeople; 
    }, 0);
  }
});

Template.singleEvent.events({
  'click .back': function(e) {
    if(Session.get('eventType') === 'All') {
      Router.go('addCommunityEvents');
    } else {
      Router.go('currentEvents');
    }
  }
});
