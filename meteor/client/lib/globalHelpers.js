Template.registerHelper("affiliatedInstitutions", function() {
  return EventOrgs.find();
});

Template.registerHelper("eventCategories", function() {
  return EventCategories.find();
});
