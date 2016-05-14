function buildFeedbackSelector(userId, institution) {

  var selector = {deleteInd: false};
  
  if (Roles.userIsInRole(userId, 'partnerAdmin')) {
    selector.eventInstitution = Meteor.users.findOne(userId).primaryPartnerOrg();
  } else {
    //TODO: make All a config value
    if(institution && institution !== "All") {
      selector.eventInstitution = institution;
    }
  }

  return selector;
}

Meteor.publish('feedback', function(institution, skipCount) {
  check(institution, String);
  check(skipCount, Number);
  
  const selector = buildFeedbackSelector(this.userId, institution);
  const eventOptions = {limit: AppConfig.public.recordsPerPage, skip: skipCount};

  //TODO: sort on timestamp
  return Feedback.find(selector, eventOptions);
  
});
