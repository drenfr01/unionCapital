Session.set('eventTypeSelected', "current");
Session.set("category", null);
Session.set("institution", null);
Session.set("eventTypeSelected", AppConfig.eventRange.current);
var searchText = new ReactiveVar(null);

Template.manageEvents.onCreated(function() {

  //this.subscribe('reservations'); 
  this.subscribe('eventCategories');
  this.subscribe('eventOrgs');
  this.subscribe('partnerOrganizations');
  this.subscribe('partnerOrgSectors');

  var template = this;
  template.autorun(function() {
    var skipCount = (currentPage() - 1) * AppConfig.public.recordsPerPage;
    template.subscribe('manageEvents', 
                   Session.get('eventTypeSelected'),
                   Session.get('institution'),
                   Session.get('category'),
                   searchText.get(),
                   skipCount
                  );
  });
});

Template.manageEvents.helpers({

  institutions: function() {
    if (Roles.userIsInRole(Meteor.userId(), 'partnerAdmin')) {
      return [{ name: Meteor.user().profile.partnerOrg }];
    } else {
      var orgs = PartnerOrgs.find().fetch();
      orgs.push({ name: 'All' });
      return _.sortBy(orgs, "name");
    }
  },

  categories: function() {
    var eventCategories = EventCategories.find().fetch();
    eventCategories.push({name: 'All'});
    return _.sortBy(eventCategories, "name");
  },

  events: function() {
    return Events.find();
  },

  eventTypeSelected: function(eventType) {
    return Session.equals("eventTypeSelected", eventType);
  },

});

Template.manageEvents.events({

  'change .radio-button': function(e) {
    Session.set('eventTypeSelected', e.target.value);
    $("#search-box").val("");
  },

  'change #institutions': function(e) {
    Session.set("institution", $("#institutions").val());
  },

  'change #categories': function(e) {
    Session.set("category", $("#categories").val());
  },

  'keyup #search-box': _.throttle(function(e) {
    var text = $(e.target).val().trim();
    if(text) {
      searchText.set(text);
    } else {
      searchText.set(null);
    }
  }, 200),

  'click .editEvent': function(e) {
    e.preventDefault();
    if(Roles.userIsInRole(Meteor.userId(), ['admin']) ||
       Meteor.user().profile.partnerOrg === this.institution) {
      Router.go('editEvent', {_id: this._id});
    } else {
      console.log('Permission Denied: You do not own this event');
      addErrorMessage('Permission Denied: You do not own this event');
    }
  },

  'click .deleteEvent': function(e) {
    if(Roles.userIsInRole(Meteor.userId(), ['admin']) ||
       Meteor.user().profile.partnerOrg === this.institution) {
      Meteor.call('deleteEvent', this._id, function(error) {
        if(error) {
          addErrorMessage(error.reason);
        }
      });
    } else {
      addErrorMessage('Permission Denied: You do not own this event');
    }
  },

  'click #addEvent': function(e) {
    e.preventDefault();
    Router.go('addEvents');
  },

  'click #clearBtn': function() {
    searchText.set(null);
    $('#search-box').val('');
    $('#search-box').focus();
  },
});

