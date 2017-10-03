Template.registerHelper("affiliatedInstitutions", function() {
  return EventOrgs.find();
});

Template.registerHelper("eventCategories", function() {
  return EventCategories.find();
});

Template.registerHelper("prevPage", function() {
  var previousPage = GlobalHelpers.currentPage() === 1 ? 1 : 
    GlobalHelpers.currentPage() - 1;
  return Router.routes.manageEvents.path({page: previousPage});
});

Template.registerHelper("nextPage", function() {
  var nextPage = GlobalHelpers.hasMorePages() ? GlobalHelpers.currentPage() + 1 :
    GlobalHelpers.currentPage();
  return Router.routes.manageEvents.path({page: nextPage});
});

Template.registerHelper("prevPageClass", function() {
  return GlobalHelpers.currentPage() <= 1 ? "disabled" : "";
});

Template.registerHelper("nextPageClass", function() {
  return GlobalHelpers.hasMorePages() ? "" : "disabled";
});

Template.registerHelper("institutions", function() {
  if (Roles.userIsInRole(Meteor.userId(), 'partnerAdmin')) {
    return [{ name: Meteor.user().primaryPartnerOrg() }];
  } else {
    var orgs = PartnerOrgs.find().fetch();
    orgs.push({ name: 'All' });
    return _.sortBy(orgs, "name");
  }
});

GlobalHelpers = (function() {

  function currentPage() {
      return parseInt(Router.current().params.page) || 1;
  }  

  return {

    currentPage,

    hasMorePages: function() {
      var totalEvents = Counts.get('eventsCount');
      return currentPage() * parseInt(AppConfig.public.recordsPerPage) < totalEvents;
    },

    eventPoints: function(trans) {
      const sum = 0;

      var event = trans.event;
      if(event && event.eventType == AppConfig.selfieEvent) {
        return '*';
      } else if(event && event.isPointsPerHour) {
        return sum + Math.round(event.pointsPerHour * trans.hoursSpent) || '?';
      } else if (event && event.points){
        return sum + event.points;
      } else {
        return 'TBD'; 
      }
    },

    //return true if selfie event, false if  
    //pre-scheduled event
    isSelfieEvent: function(trans) {
      //note: new selfie events have an eventId of 'new' rather
      //than the legacy selfie events which have no eventId (i.e. no key)
      var newSelfieEventId = 'new';
      return R.isNil(trans.eventId) || trans.eventId === newSelfieEventId  ? 
        true : false;
    },

  }
})();

