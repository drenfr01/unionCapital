Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  //Home Page
  this.route('landing', {path: '/'});
  
  //Member Routes
  this.route('memberHomePage', {path: '/memberHome'});
  this.route('communityNeeds', {path: '/communityNeeds'});
  this.route('takePicture', {path: '/takePicture'});
  this.route('checkPoints', {path: '/checkPoints'});
  this.route('listEvents', {path: '/listEvents'});

  //Admin Routes
  this.route('adminHomePage', {path: '/admin'});
  this.route('addCommunityEvents', {path: '/addCommunityEvents'});
  this.route('reviewPhotos', {path: '/reviewPhotos'});
  this.route('memberProfiles', {path: '/memberProfiles'});

  //Generic
  this.route('pending', {path: '/*'});
});

var requireAdminLogin = function() {
  if (! Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    Router.go('landing');
    throwError("Admin only area", 'alert-danger');
  } 
};

var requireMemberLogin = function() {
  if (! Meteor.user()) {
    Router.go('landing');
    throwError("Please Log In!", 'alert-danger');
  } 
};

Router.onBeforeAction(requireMemberLogin,{except: ['landing']} );
Router.onBeforeAction(requireAdminLogin,
  {only: ['adminHomePage', 'addCommunityEvents', 'reviewPhotos']} );

//This can be used to reset session variables that are really page variables
Router.onBeforeAction(function() {
});
