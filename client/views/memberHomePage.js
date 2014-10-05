Template.memberHomePage.rendered = function() {
  var d = document;
  var s = 'script';
  var id = 'facebook-jssdk';
      
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); 
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1518343331716121&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
};

Template.memberHomePage.helpers({
  'currentMemberName': function() {
    if(Meteor.user()) {
      return Meteor.user().profile.firstName || "";
    }
  }
});
Template.memberHomePage.events({
  'click #quickCheckIn': function(e) {
    e.preventDefault();
    Router.go('quickCheckIn');
  },
  'click #takePhoto': function(e) {
    e.preventDefault();
    Router.go('submitNewEvent');
  }
});
