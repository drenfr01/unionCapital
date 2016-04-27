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
  }
})();

