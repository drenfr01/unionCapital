Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('events'); }
});

//Route security

var requireMemberLogin = function() {
  if (! Roles.userIsInRole(Meteor.userId(), ['user'])) {
    if(Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('landing');
    }
  } else {
    this.next();
  }
};

var requireSuperAdminLogin = function() {
  if (! Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    if(Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.redirect('landing');
    }
  } else {
    this.next();
  }
};


//General Security for non-logged in users. May eventually 
//want a few screens that "guests" can browse
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (!Meteor.user()) {
    this.redirect('login');
  } else {
    this.next();
  }
},
  {except: ['login', 'createNewUser', 'collectUserDemographics']} 
);

//Members
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (Roles.userIsInRole(Meteor.userId(), ['user'])) {
    this.next();
  } else {
    this.redirect('login');
  }
},
  //NOTE: whitelist routes here, i.e. if you add a new route for members
  {only: ['memberHomePage', 'eventsCalendar', 'checkPoints', 'contactUs','share']} 
);

//Partner Admins
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (Roles.userIsInRole(Meteor.userId(), ['partnerAdmin'])) {
    this.next();
  } else {
    this.redirect('login');
  }
}
  //NOTE: whitelist routes here, i.e. if you add a new route for members
);

//Super Admins
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    this.next();
  } else {
    this.redirect('login');
  }
},
  //NOTE: whitelist routes here, i.e. if you add a new route for superAdmins
  {only: ['adminHomePage', 'allMembers', 'viewMemberProfile', 'addCommunityEvents']} 
);


Router.route('/viewMemberProfile/:_id', function () {
  this.render('viewMemberProfile', {
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
  });
}, {
  name: 'viewMemberProfile'
});


Router.map(function() {
  //Home Page
  this.route('/', function() {
    this.render('breakScreen');
  });

  this.route('/eventSearch', function() {
    this.render('eventsHomeScreen');
  });

  this.route('/login', function() {
    this.render('landing');
  });

  this.route('/createNewUser', function() {
    this.render('createNewUser');
  });

  this.route('/collectUserDemographics', function() {
    this.render('collectUserDemographics');
  });

  this.route('/forgotPassword', function() {
    this.render('forgotPassword');
  });
  //Member Routes
  this.route('facebookLogin', {path: '/facebookLogin'});
  this.route('/memberProfile', function() {
    this.render('memberProfile');
  });

  this.route('/eventsCalendar', function() {
    this.render('eventsCalendar');
  });

  this.route('memberHomePage', {path: '/memberHomePage'});
  this.route('communityNeeds', {path: '/communityNeeds'});
  this.route('/share', function() {
    this.render('share');
  });
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
  this.route('topPointsList', {path: 'topPointsList'});

  //Admin Routes
  this.route('/allMembers', function() {
    this.render('allMembers');
  });
  this.route('adminHomePage', {path: '/adminHomePage'});
  this.route('addCommunityEvents', {path: '/addCommunityEvents'});
  this.route('addRewards', {path: '/addRewards'});
  this.route('reviewPhotos', {path: '/reviewPhotos'});
  this.route('memberProfiles', {path: '/memberProfiles'});
  this.route('listMembers', {path: '/listMembers'});

});

