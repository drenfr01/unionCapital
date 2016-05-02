var institution = new ReactiveVar(null);

Template.feedback.onCreated(function() {
  var template = this;
  template.subscribe('partnerOrganizations');

  template.autorun(function() {
    var skipCount = (GlobalHelpers.currentPage() - 1) * 
      AppConfig.public.recordsPerPage;
      template.subscribe('feedback', institution.get(), skipCount);
  });
});


Template.feedback.helpers({
  
});

Template.feedback.events({
  'change #institutions': function(e) {
    institution.set($("#institutions").val());
  },

  'click .event': function(e) {
    console.log(e) 
  },
});
