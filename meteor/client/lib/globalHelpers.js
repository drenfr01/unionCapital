Template.registerHelper("affiliatedInstitutions", function() {
  return EventOrgs.find();
});

Template.registerHelper("eventCategories", function() {
  return EventCategories.find();
});

Template.registerHelper("prevPage", function() {
  var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
  return Router.routes.manageEvents.path({page: previousPage});
});

Template.registerHelper("nextPage", function() {
  var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
  return Router.routes.manageEvents.path({page: nextPage});
});

Template.registerHelper("prevPageClass", function() {
  return currentPage() <= 1 ? "disabled" : "";
});

Template.registerHelper("nextPageClass", function() {
  return hasMorePages() ? "" : "disabled";
});

var currentPage = function() {
  return parseInt(Router.current().params.page) || 1;
}

var hasMorePages = function() {
  var totalEvents = Counts.get('eventsCount');
  return currentPage() * parseInt(AppConfig.public.recordsPerPage) < totalEvents;
}



