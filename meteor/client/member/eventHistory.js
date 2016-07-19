Template.eventHistory.onCreated(function(){
  var template = this;
  template.autorun(function() {
    template.subscribe('eventHistoryForUser');
  });
});
