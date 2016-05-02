Meteor.publish('feedback', function(institution, skipCount) {
  check(institution, String);
  check(skipCount, Number);

  
});
