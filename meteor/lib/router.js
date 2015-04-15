Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('events'); }
});

//Route security

//General Security for non-logged in users. May eventually
//want a few screens that "guests" can browse
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (!Meteor.user()) {
    console.log("redirecting guest user");
    this.redirect('login');
  } else {
    this.next();
  }
},
  {except: ['login', 'signup', 'collectUserDemographics', 'forgot']}
);

//Members
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (Roles.userIsInRole(Meteor.userId(), ['user'])) {
    this.next();
  } else {
    console.log("redirect member");
    this.redirect('login');
  }
},
  //NOTE: whitelist routes here, i.e. if you add a new route for members
  {only: ['memberHomePage','memberProfile', 'editMemberProfile','eventsCalendar', 'checkPoints', 'contactUs','share']}
);

//Both Admins
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (Roles.userIsInRole(Meteor.userId(), ['partnerAdmin']) ||
           Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    this.next();
  } else {
    console.log("redirecting joint admin");
    this.redirect('login');
  }
},
  //NOTE: whitelist routes here, i.e. if you add a new route for members
  {only: ['allMembers', 'viewMemberProfile','manageEvents', 'exportData', 'approveTransactions']}
);

//Partner Admins
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (Roles.userIsInRole(Meteor.userId(), ['partnerAdmin'])) {
    this.next();
  } else {
    console.log("redirecting partner admin");
    this.redirect('login');
  }
},
  //NOTE: whitelist routes here, i.e. if you add a new route for members
  {only: ['partnerAdminHomePage']}
);

//Super Admins
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    this.next();
  } else {
    console.log("redirecting super admin");
    this.redirect('login');
  }
},
  //NOTE: whitelist routes here, i.e. if you add a new route for superAdmins
  {only: ['adminHomePage',
   'addCommunityEvents',
   'partnerAdminView',
   'addPartnerAdminUser',
   'addPartnerOrg',
   'partnerOrgs',
   'uploadEvents']}
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

Router.route('/editmemberprofile', function() {
  this.render('editMemberProfile');
}, {
  name: 'editMemberProfile'
});

Router.route('/exportData', function() {
  this.render('exportData');
},
{
  name: 'exportData'
});

Router.route('/addPartnerAdminUser', function() {
  this.render('addPartnerAdminUser');
},
{
  name: 'addPartnerAdminUser'
});

Router.route('/addPartnerOrg', function() {
  this.render('addPartnerOrg');
},
{
  name: 'addPartnerOrg'
});

Router.route('/partnerOrgs', function() {
  this.render('partnerOrgs');
},
{
  name: 'partnerOrgs'
});

Router.route('/partnerAdminView', function() {
  this.render('partnerAdminView');
},
{
  name: 'partnerAdminView'
});

Router.route('/addEvents', function() {
  this.render('addEvents');
},
{
  name: 'addEvents'
});

Router.route('/uploadEvents', function() {
  this.render('uploadEvents');
},
{
  name: 'uploadEvents'
});

Router.route('/editEvent/:_id', function () {
  this.render('editEvent', {
    data: function () {
      return Events.findOne({_id: this.params._id});
    }
  });
}, {
  name: 'editEvent'
});


Router.route('/viewPartnerMemberProfile/:_id', function () {
  this.render('viewPartnerMemberProfile', {
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
  });
}, {
  name: 'viewPartnerMemberProfile'
});


Router.route('/manageEvents', function() {
  this.render('manageEvents');
},
{
  name: 'manageEvents'
});

Router.route('/partnerAdminPage', function() {
  this.render('partnerAdminHomePage');
},
{
  name: 'partnerAdminHomePage'
});

Router.route('/partnerMembers', function() {
  this.render('partnerMembers');
},
{
  name: 'partnerMembers'
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

  this.route('/signup', function() {
    this.render('createNewUser');
  });

  this.route('/collectUserDemographics', function() {
    this.render('collectUserDemographics');
  });

  this.route('/forgot', function() {
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

  this.route('eventCheckinDetails', {
    path: 'checkin/:id',
    data: function() {
      return Events.findOne({_id: this.params.id});
    }
  });

  this.route('checkPoints', {
    path: '/checkPoints'
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
    path: '/singleEvent/:_id',
    data: function() { return Events.findOne({_id: this.params._id }); }
  });

  //TODO: I don't know how to do polymorphic routes yet,
  //but ideally the below two routes would be combined
  //into one
  this.route('checkin', {
    path: '/checkin',
    template: 'checkIntoEvent',
    // data: function() {
    //   return this.params.hash;
    // }
  });
  this.route('showMemberRewards', {path: '/rewards'});
  this.route('contactUs', {path: '/contactUs'});
  this.route('topPointsList', {path: 'topPointsList'});

  //Admin Routes
  this.route('/allMembers', function() {
    this.render('allMembers');
  });
  this.route('adminHomePage', {path: '/adminHomePage'});
  this.route('addCommunityEvents', {path: '/addCommunityEvents'});
  this.route('addRewards', {path: '/addRewards'});
  this.route('approveTransactions', {path: '/approve'});
  this.route('memberProfiles', {path: '/memberProfiles'});
  this.route('listMembers', {path: '/listMembers'});

});

