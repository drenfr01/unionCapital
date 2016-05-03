var institution = new ReactiveVar(null);

Template.feedback.onCreated(function() {
  institution.set('All')
  this.subscribe('partnerOrganizations');

  var template = this;
  template.autorun(function() {
    var skipCount = (GlobalHelpers.currentPage() - 1) * 
      AppConfig.public.recordsPerPage;
    template.subscribe('feedback', institution.get(), skipCount);
  });
});


Template.feedback.helpers({
  feedback: function() {
    return Feedback.find(); 
  },
  getEventId: function() {
    return {_id: this.eventId};
  }
});

Template.feedback.events({
  'change #institutions': function(e) {
    institution.set($("#institutions").val());
  },

  'click .event': function(e) {
    console.log(e) 
  },
});
