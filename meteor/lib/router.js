Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',

  // waitOn: function() { return Meteor.subscribe('events'); }
});

// Clear alerts when moving to a new page
Router.onAfterAction(function() {
  Alerts.remove({});
});

//Route security

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
  {except: ['login', 'signup', 'collectUserDemographics', 'forgot']}
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
  {only: ['memberHomePage','memberProfile', 'editMemberProfile','eventsCalendar', 'checkPoints', 'contactUs']}
);

//Both Admins
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (Roles.userIsInRole(Meteor.userId(), ['partnerAdmin']) ||
           Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    this.next();
  } else {
    this.redirect('login');
  }
},
  //NOTE: whitelist routes here, i.e. if you add a new route for members
  {only: ['allMembers', 'viewMemberProfile','manageEvents', 'exportData', 'approveTransactions']}
);

Router.onBeforeAction(function() {
  uiHelpers.closeNavDropdown();
  this.next();
});

//Partner Admins
Router.onBeforeAction(function() {
  if(Meteor.loggingIn()) {
    return; //wait
  } else if (Roles.userIsInRole(Meteor.userId(), ['partnerAdmin'])) {
    this.next();
  } else {
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
   'uploadEvents',
   'imageViewer']}
);

Router.route('/allMembers/:page?', function() {
    this.render('allMembers');
}, {
  name: 'allMembers'
});

Router.route('/viewMemberProfile/:_id', function () {
  this.render('viewMemberProfile', {
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
  });
}, {
  name: 'viewMemberProfile'
});

Router.route('/imageviewer', function () {
  this.render('imageViewer');
}, {
  name: 'imageViewer'
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

Router.route('/editEvent/:_id', {
  name: 'editEvent',

  template: 'editEvent',

  data: function () {
    return Events.findOne({_id: this.params._id});
  },

  subscriptions: function() {
    var self = this;
    return Meteor.subscribe('singleEvent', self.params._id);
  },

  action: function () {
    if (this.ready()) {
      this.render();
    } else {
      this.render('loading');
    }
  }
});

Router.route('/checkpoints', function () {
  this.render('checkPoints', {
    data: function () {
      return Meteor.user();
    },

    subscriptions: function() {
      // this.subscribe('transactions')
      return Meteor.subscribe('eventsForUser')
    },

    action: function () {
      if (this.ready()) {
        this.render();
      } else {
        this.render('loading');
      }
    }
  });
}, {
  name: 'checkPoints'
});

Router.route('/signup/:template', function() {
  this.render('signup', {
    data: function() {
      return this.params.template;
    }
  });
}, {
  name: 'signup'
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


Router.route('/manageEvents/:page?', {
  template: 'manageEvents',
  name: 'manageEvents'
});

Router.route('/eventsHistory/:page?', {
  template: 'eventsHistory',
  name: 'eventsHistory'
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
    this.render('landing');
  });

  this.route('/eventSearch', function() {
    this.render('eventsHomeScreen');
  });

  this.route('/login', function() {
    this.render('landing');
  });


  this.route('/forgot', function() {
    this.render('forgotPassword');
  });
  //Member Routes
  this.route('facebookLogin', {path: '/facebookLogin'});
  this.route('/memberProfile', function() {
    this.render('memberProfile');
  });

  this.route('eventsCalendar', {
    path: '/calendar',
    subscriptions: function() {
      var start = moment().add(AppConfig.eventCalendar.past.hoursBehind, 'h').toDate();
      var end = moment().add(AppConfig.eventCalendar.future.hoursAhead, 'h').toDate();
      Meteor.subscribe('events', start, end);
    }
    // no need to wait on subs here, the search function handles that
  });

  this.route('memberHomePage', {path: '/memberhome'});
  this.route('communityNeeds', {path: '/communityNeeds'});

  this.route('eventCheckinDetails', {
    path: 'checkin/:id',
    data: function() {
      return Events.findOne({_id: this.params.id});
    },
    subscriptions: function() {
      return Meteor.subscribe('singleEvent', this.params.id);
    },
    action: function() {
      if (this.ready())
        this.render();
      else
        this.render('loading');
    }
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
    path: '/event/:_id',
    data: function() { return Events.findOne({_id: this.params._id }); },
    subscriptions: function() {
      return Meteor.subscribe('singleEvent', this.params._id);
    },
    action: function() {
      if (this.ready())
        this.render();
      else
        this.render('loading');
    }
  });

  //TODO: I don't know how to do polymorphic routes yet,
  //but ideally the below two routes would be combined
  //into one
  this.route('checkin', {
    path: '/checkin',
    template: 'checkIntoEvent',
    subscriptions: function() {
      var start = moment().add(AppConfig.checkIn.past.hoursBehind, 'h').toDate();
      var end = moment().add(AppConfig.checkIn.today.hoursAhead, 'h').toDate();
      Meteor.subscribe('events', start, end);
    }
    // no need to wait on subs here, the search function handles that
  });
  this.route('showMemberRewards', {path: '/rewards'});
  this.route('contactUs', {path: '/contactUs'});
  this.route('topPointsList', {path: 'topPointsList'});

  //Admin Routes
  this.route('adminHomePage', {path: '/adminHomePage'});
  this.route('addCommunityEvents', {path: '/addCommunityEvents'});
  this.route('addRewards', {path: '/addRewards'});
  this.route('approveTransactions', {
    path: '/approve',

    subscriptions: function() {
      return Meteor.subscribe('eventsForTransactions');
    },

    action: function () {
      if (this.ready()) {
        this.render();
      } else {
        this.render('loading');
      }
    }
  });
  this.route('listMembers', {path: '/listMembers'});

});

