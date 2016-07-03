Session.setDefault('rsvpList', null);
Session.set('whitelist', null);

Template.singleEvent.onCreated(function() {
  this.subscribe('reservations');
});

Template.singleEvent.helpers({
  'rsvpList': function() {
    return Reservations.find({eventId: this._id});
  },
  isPointsPerHour: function() {
    return this.isPointsPerHour;
  },

  whitelistMembers: function() {
    if (this.privateEvent) {
      Meteor.call('getWhitelistMembers', this._id, function(error, data) {
        if(error) {
          console.log(error.reason); 
        }  else {
            Session.set('whitelist', data);
        }
      });
    } 

    return Session.get('whitelist');
  }
});

Template.singleEvent.events({
  'click .back': function(e) {
    if(Roles.userIsInRole(Meteor.userId(), ['user'])) {
      Router.go('eventsCalendar');
    } else {
      Router.go('manageEvents');
    }
  }
});
