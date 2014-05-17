Meteor.subscribe('events');
Meteor.subscribe('images');
Meteor.subscribe('adminMemberData');

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});
