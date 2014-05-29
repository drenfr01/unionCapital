Meteor.subscribe('events');
Meteor.subscribe('transactions');
Meteor.subscribe('images');
Meteor.subscribe('adminMemberData');

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});
