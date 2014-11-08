Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('events'); }
});

Router.map(function() {
  //Home Page
  this.route('landing', {path: '/'});

  //Member Routes
  this.route('facebookLogin', {path: '/facebookLogin'});
  this.route('memberHomePage', {path: '/memberHome'});
  this.route('communityNeeds', {path: '/communityNeeds'});
  this.route('submitNewEvent', {
    path: '/submitNewEvent',
    template: 'takePicture'
  });
  this.route('takePicture', {
    path: '/takePicture/:_id',
    data: function() { return Events.findOne({_id: this.params._id}); }
  });
  this.route('checkPoints', {
    path: '/checkPoints/:_id',
    data: function() { return Meteor.users.findOne({_id: this.params._id}); }
  });
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
  this.route('singleEvent', {
    path: '/singleEvents/:_id',
    data: function() { return Events.findOne({_id: this.params._id }); }
  });
  
  //TODO: I don't know how to do polymorphic routes yet,
  //but ideally the below two routes would be combined
  //into one
  this.route('checkIntoEvent', {
    path: '/checkIntoEvent/:eventId',
    template: 'checkIntoEvent',
    data: function() {
      return this.params.eventId;
    }
  });
  this.route('showMemberRewards', {path: '/rewards'});
  this.route('quickCheckIn', {path: '/quickCheckIn' });
  this.route('contactUs', {path: '/contactUs'});

  //Admin Routes
  this.route('adminHomePage', {path: '/admin'});
  this.route('addCommunityEvents', {path: '/addCommunityEvents'});
  this.route('addRewards', {path: '/addRewards'});
  this.route('reviewPhotos', {path: '/reviewPhotos'});
  this.route('memberProfiles', {path: '/memberProfiles'});
  this.route('listMembers', {path: '/listMembers'});

});

var requireAdminLogin = function() {
  if (! Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    if(Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
};

var requireMemberLogin = function() {
  if (! Meteor.user()) {
    if(Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
};

/*
Router.onBeforeAction(requireMemberLogin,{except: ['landing']} );
Router.onBeforeAction(requireAdminLogin,
 {only: ['adminHomePage', 'addCommunityEvents', 'addRewards', 'reviewPhotos', 'memberProfiles']} );
*/

