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
    if(Meteor.user() && Meteor.user().profile) {
      return Meteor.user().profile.firstName || "";
    } else {
      return "";
    }
  },
  totalPoints: function() {
    return Meteor.users.totalPointsFor(Meteor.userId());
  }
});

Template.memberHomePage.events({
  'click #lnkTotalPoints': function(e) {
    e.preventDefault();
    Router.go('checkPoints');
  },

  'click #lnkEvents': function(e) {
    e.preventDefault();
    Router.go("eventsCalendar");
  },

  'click #lnkCheckIn': function(e) {
    e.preventDefault();
    Router.go('checkin');
  }
});
