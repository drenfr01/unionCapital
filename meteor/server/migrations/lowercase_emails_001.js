var lowercaseEmails = function () {
  Meteor.users.find().forEach(function(user)  {
    updatedEmails = _.map(user.emails, function(email) {
      addr = email['address'];
      if(addr.toLowerCase !== addr)
        console.log("DEBUG: Changing " + addr + "to lowercase.");
      email['address'] = addr.toLowerCase();
      return email;
    });
    Meteor.users.update({_id: user._id}, {$set: {emails: updatedEmails}});
  });
}

var backwards = function () {
  console.log('This migration has no "down" because you can log in with a mixed case address when the username is recorded as lowercase');
}

Migrations.add({
  version: 1,
  name: 'Change all email addresses to be lowercase',
  up: lowercaseEmails,
  down: backwards,
});

