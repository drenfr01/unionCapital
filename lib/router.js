Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound'
});

Router.map(function() {
  //Home Page
  this.route('landing', {path: '/'});

  //Member Routes
  this.route('facebookLogin', {path: '/facebookLogin'});
  this.route('memberHomePage', {path: '/memberHome'});
  this.route('communityNeeds', {path: '/communityNeeds'});
  this.route('takePicture', {path: '/takePicture'});
  this.route('checkPoints', {path: '/checkPoints'});
  this.route('exploreEvents', {path: '/exploreEvents'});
  this.route('listEvents', {
    path: '/listEvents'
  });
  this.route('currentEvents', {
    template: 'listEvents',
    path: '/currentEvents',
    data: function() {
      return 'Current';
    }
  });
  this.route('upcomingEvents', {
    template: 'listEvents',
    path: '/upcomingEvents',
    data: function() {
      return 'Upcoming';
    }
  });
  this.route('checkIntoEvent', {
    path: '/checkIntoEvent'
  });
  this.route('showMemberRewards', {path: '/rewards'});
  this.route('checkIntoEvent', {path: '/checkIntoEvent'});

  //Admin Routes
  this.route('adminHomePage', {path: '/admin'});
  this.route('addCommunityEvents', {path: '/addCommunityEvents'});
  this.route('addRewards', {path: '/addRewards'});
  this.route('reviewPhotos', {path: '/reviewPhotos'});
  this.route('memberProfiles', {path: '/memberProfiles'});

  //Generic
  this.route('pending', {path: '/*'});
});

var requireAdminLogin = function() {
  if (! Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    Meteor.logout();
    Router.go('landing');
    addErrorMessage("Admin only area");
  }
};

var requireMemberLogin = function() {
  if (! Meteor.user()) {
    Meteor.logout();
    Router.go('landing');
    addErrorMessage("Please Log In!");
  }
};

/*
Router.onBeforeAction(requireMemberLogin,{except: ['landing']} );
Router.onBeforeAction(requireAdminLogin,
 {only: ['adminHomePage', 'addCommunityEvents', 'addRewards', 'reviewPhotos', 'memberProfiles']} );
*/

//This can be used to reset session variables that are really page variables
Router.onAfterAction(function() {
  Meteor.setTimeout(clearAlerts, 8000);
});
