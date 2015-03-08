Template.manageEvents.helpers({
  institutions: function() {
    return PartnerOrgs.find();
  },
  categories: function() {
    return EventCategories.find();
  },
  events: function() {
    return Events.find({deleteInd: false}, {sort: {eventDate: 1}});
  }
});
