/*
Accounts.validateNewUser(function(user) {
  //this grabs the email address out of the user email
  var emails = _.pluck(_.flatten(_.pluck(Meteor.users.find().fetch(),
        'emails')),'address');
  if(user.email in emails) {
    return false;
  } else {
    return true;
  }
});
*/
