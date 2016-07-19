Template.memberHomePage.onRendered(function() {

  //Loads the FB plugin
  _.defer(function() {
    FB.XFBML.parse();
  });
});

Template.memberHomePage.onCreated(function() {
  this.subscribe('transactions', {deleteInd: false, approved: true}, {limit: 5});
});

Template.memberHomePage.helpers({
  'currentMemberName': function() {
    if(Meteor.user() && Meteor.user().profile) {
      return Meteor.user().profile.firstName || '';
    }
    return '';
  },
});
