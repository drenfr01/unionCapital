Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  //Home Page
  this.route('landing', {path: '/'});
  this.route('loginPage', {path: 'loginPage'});
  this.route('createUser', {path: 'createUser'});

  //Member Routes
  this.route('memberHomePage', {path: '/memberHome'});
  this.route('communityNeeds', {path: '/communityNeeds'});
  this.route('takePicture', {path: '/takePicture'});
  this.route('checkPoints', {path: '/checkPoints'});
  this.route('listEvents', {path: '/listEvents'});
  this.route('scanQR', {path: '/scanQR'});

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
    addErrorMessage("Admin only area");
  }
};

var requireMemberLogin = function() {
  if (! Meteor.user()) {
    Router.go('landing');
    addErrorMessage("Please Log In!");
  }
};


Router.onBeforeAction(requireMemberLogin,{except: ['landing']} );
Router.onBeforeAction(requireAdminLogin,
  {only: ['adminHomePage', 'addCommunityEvents', 'reviewPhotos']} );


//This can be used to reset session variables that are really page variables
Router.onBeforeAction(function() {
});
