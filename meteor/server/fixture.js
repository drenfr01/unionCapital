Meteor.startup(function () {
  //Seeding Partner Org Sectors
  if(PartnerOrgSectors.find().count() === 0) {
    var sectors = [
      'Education',
      'Health',
      'Finance',
      'Community'
    ];

    _.each(sectors, function(sector) {
      PartnerOrgSectors.insert({name: sector, deleteInd: false});
    });
  }

  //Seeding Partner Organizations
  if( Meteor.settings.env === 'dev' && PartnerOrgs.find().count() === 0 ) {
    var partnerOrgs = [
      {name: "Codman Academy", description: "Charter Public Schools",
        sector: "Education", membersReported: 50, deleteInd: false},
      {name: "Codman Health Center", description: "Improving physical, mental, and social well-being of the community",
        sector: "Health", membersReported: 50, deleteInd: false},
      {name: "FII", description: "Supporting economic and social mobility in America",
        sector: "Finance", membersReported: 100, deleteInd: false},
      {name: "KIPP Academy Boston", description: "College Prep Public Schools",
        sector: "Education", membersReported: 50, deleteInd: false},
      {name: "Nurtury Learning Lab", description: "Where kids and communities grow",
        sector: "Education", membersReported: 15, deleteInd: false},
      {name: "Project Hope", description: "Where families move up and out of poverty",
        sector: "Community", membersReported: 20, deleteInd: false},
      {name: "Smart from the Start", description: "Preventing the Achievement Gap",
        sector: "Education", membersReported: 50, deleteInd: false},
      {name: "Thrive in Five", description: "Family Engagement through parent leadership",
        sector: "Education", membersReported: 15, deleteInd: false},
      {name: "Union Capital Boston", description: "Overcoming the Poverty Trap",
        sector: "Community", membersReported: 300, deleteInd: false},
      {name: "Other", description: "Other", 
        sector: "Community", membersReported: 50, deleteInd: false}
    ];

    _.each(partnerOrgs, function(org) {
      PartnerOrgs.insert(org);
    });
  }

  //Seeding Number of Kids
  if(Kids.find().count() === 0) {
    var kids = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6+'
    ];

    _.each(kids, function(kid) {
      Kids.insert({number: kid, deleteInd: false});
    });
  }

  //Seeding Number of People for Reservations
  if(NumberOfPeople.find().count() === 0) {
    var people = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10+'
    ];

    _.each(people, function(person) {
      NumberOfPeople.insert({number: person, deleteInd: false});
    });
  }
  //Seeding Races/ethnicities
  if(Races.find().count() === 0) {
    var races = [
      'American Indian, Alaskan Native, Native Hawaiian',
      'Asian',
      'Black or African-American',
      'Hispanic/Latino',
      'White, Caucasian',
      '2+ Races',
      'Other'
    ];

    _.each(races, function(race) {
      Races.insert({name: race, deleteInd: false});
    });
  }

  //Seeding event categories
  if( EventCategories.find().count() === 0 ) {
    var eventCategories =
      ['Education (Child/Adult)',
        'Health (Physical & Mental)',
        'Finances/Employment',
        'Community & Service',
        'Other'
    ];
    _.each(eventCategories, function(category) {
      EventCategories.insert({name: category, deleteInd: false});
    });
  }

  //Note: this list will differ from partner orgs, because we may
  //find organizations sponsoring events that aren't UCB partners yet
  if( Meteor.settings.env === 'dev' && EventOrgs.find().count() === 0 ) {
    var organizations =
      [ 'BMC Health Net Plan',
        'Codman Academy',
        'Codman Health Center',
        'FII',
        'KIPP Academy Boston',
        'Nurtury Learning Lab',
        'Project Hope',
        'Smart from the Start',
        'Thrive in 5',
        'Other'
    ];

    _.each(organizations, function(organization) {
      EventOrgs.insert({organization: organization});
    });
  }

  //Seeding UCB App Access Devices
  if(UCBAppAccess.find().count() === 0) {
    var devices = [
      'Mobile phone',
      'iPad/Tablet',
      'Computer or laptop',
      'UCB Paper App'
    ];

    _.each(devices, function(device) {
      UCBAppAccess.insert({device: device, deleteInd: false});
    });
  }
  // Users fixture
  if ( Meteor.settings.env === 'dev' && Meteor.users.find().count() === 0 ) {
    var users = [
      {
         email: "admin@gmail.com", username: "admin", password: "admin",
         name: "admin", roles:['admin']
      },
      {
        email: "user@gmail.com", username: "user", password: "user",
        profile: {
          firstName: 'Test',
          lastName: 'User',
          street1: '10 Emerson',
          street2: "24H",
          city: 'Boston',
          state: 'MA',
          zip: '02114',
          gender: "male",
          partnerOrg: "KIPP Academy Boston",
          numberOfKids: "2",
          reducedLunch: 'yes',
          medicaid: 'yes',
          race: "Black or African-American",
          UCBAppAccess: 'iPad/Table'
        },
        roles:['user']
      },
      {
        email: "KIPPUser@gmail.com", username: "KIPPUser", password: "user",
        profile: {
          firstName: 'kipp',
          lastName: 'User',
          street1: '101 Main St',
          street2: "",
          city: 'Cambridge',
          state: 'MA',
          zip: '02142',
          gender: 'female',
          partnerOrg: "KIPP Academy Boston",
          numberOfKids: "4",
          reducedLunch: 'no',
          medicaid: 'no',
          race: "White",
          UCBAppAccess: 'Computer or laptop'
        },
        roles:['user']
      },
      {
        email: "user2@gmail.com", username: "user2", password: "user",
        profile: {
          firstName: 'Test2',
          lastName: 'User2',
          street1: '1 Rogers St',
          street2: "",
          city: 'Boston',
          state: 'MA',
          zip: '02141',
          gender: 'female',
          partnerOrg: "Thrive in Five",
          numberOfKids: "1",
          reducedLunch: 'yes',
          medicaid: 'yes',
          UCBAppAccess: 'Mobile phone',
          race: "White, Caucasian"
        },
        roles:['user']
      },
      {
        email: "laura@gmail.com", username: "laura",
        password: "admin",
        profile: {
          firstName: 'Laura',
          lastName: 'Ballek',
          street1: '101 Main St',
          street2: '2B',
          city: 'Cambridge',
          state: 'MA',
          zip: '02142',
          partnerOrg: "KIPP Academy Boston"
        },
        roles: ['partnerAdmin']
      }
    ];

    _.each(users, function(user){
      var id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: user.profile,
      });

      Roles.addUsersToRoles(id, user.roles);

    });

    //Add Houston Admin users
    var admin = Meteor.users.findOne({name: admin});
    Meteor.call("_houston_make_admin", admin._id);
  }
  //Events fixture
  if ( Events.find().count() === 0 && Meteor.settings.env === 'dev' ) {
    //NOTE: months are 0 based for dates
    var cambridgeScienceFestivalDate = HelperFunctions.addDays(new Date(), 7);
    var cambridgeScienceFestivalDuration = 3;

    var somervilleCookingFestivalDate =  HelperFunctions.addDays(new Date(), -7);
    var somervilleCookingFestivalDuration = 5;

    var bostonMusicFestivalDate = new Date();
    var bostonMusicFestivalDuration = 3;

    var cambridgeFilmFestivalDate = HelperFunctions.addDays(new Date(), 1);
    var cambridgeFilmFestivalDuration = 1;
    var events = [
      {
        name: 'Cambridge Science Festival',
        address: '1 Kendall Sq, Cambridge, MA',
        latitude: '42.3677845',
        longitude: '-71.0899675',
        url: 'http://example.com/CSF',
        description: 'A festival of science for everybody',
        active: 1,
        eventDate: cambridgeScienceFestivalDate,
        endTime: addHours(moment(cambridgeScienceFestivalDate).toDate(), cambridgeScienceFestivalDuration),
        duration: cambridgeScienceFestivalDuration,
        institution: "KIPP Academy Boston",
        category: "Education (Child/Adult)",
        isPointsPerHour: true,
        pointsPerHour: 100,
        adHoc: false,
        deleteInd: false
      },
      {
        name: 'Somerville Cooking Festival',
        address: '189 Massachusetts Ave, Somerville, MA',
        latitude: '42.3453621',
        longitude: '-71.0871995',
        url: 'http://example.com/SCF',
        description: 'A festival of cooking for the masses',
        active: 1,
        eventDate: somervilleCookingFestivalDate,
        endTime: addHours(moment(somervilleCookingFestivalDate).toDate(), somervilleCookingFestivalDuration),
        duration: somervilleCookingFestivalDuration,
        institution: "Thrive in Five",
        category: "Health (Physical & Mental)",
        isPointsPerHour: false,
        points: 50,
        adHoc: false,
        deleteInd: false
      },
      {
        name: 'Boston Music Festival',
        address: '26 Vassar St, Boston, MA',
        latitude: '42.2999257',
        longitude: '-71.0773658',
        url: 'http://example.com/BMF',
        description: 'Music festival; all styles - join us soon!',
        active: 1,
        eventDate: bostonMusicFestivalDate,
        endTime: addHours(moment(bostonMusicFestivalDate).toDate(), bostonMusicFestivalDuration),
        duration: bostonMusicFestivalDuration,
        institution: "KIPP Academy Boston",
        category: "Education (Child/Adult)",
        isPointsPerHour: true,
        pointsPerHour: 100,
        adHoc: false,
        deleteInd: false
      },
      {
        name: 'Cambridge Film Festival',
        address: '18 Davis Sq, Somerville, MA',
        latitude: '42.3966813',
        longitude: '-71.1226578',
        url: 'http://example.com/CFF',
        description: 'Watch as many films as you can in just 3 days of mandness!',
        active: 1,
        eventDate: cambridgeFilmFestivalDate,
        endTime: addHours(moment(cambridgeFilmFestivalDate).toDate(), cambridgeFilmFestivalDuration),
        duration: cambridgeFilmFestivalDuration,
        institution: "Thrive in Five",
        category: "Education (Child/Adult)",
        isPointsPerHour: false,
        points: 150,
        adHoc: false,
        deleteInd: false
      },
      //TODO: remove admin add points, it's no longer used
      //This is quite hacky, but the below event only exists to allow admins to add
      //transactions linked to this event. Basically we'll adjust the hours / minutes
      //to give the appropriate number of points an admin gives
      {
        name: 'Admin Add Points',
        address: 'Boston, MA',
        url: 'unioncapitalboston.com',
        description: 'Union Capital administrator adding points to your account',
        active: 0,
        eventDate: new Date(),
        duration: 0,
        institution: "Other",
        category: "Other",
        isPointsPerHour: true,
        pointsPerHour: 100,
        adHoc: true,
        deleteInd: true
      },
      //Hacks love company. This allows users to receive 50 bonus points  
      //if they wear a ucb button and submit a photo
      {
        name: AppConfig.ucbButtonEvent,
        address: 'Boston, MA',
        url: 'unioncapitalboston.com',
        description: 'The UCB member wore a UCB button to an event',
        active: 0,
        eventDate: new Date(),
        duration: 0,
        institution: "Other",
        category: "Other",
        isPointsPerHour: false,
        points: 50,
        adHoc: true,
        deleteInd: true
      }
    ];

    _.each(events, function(event){
      Events.insert({
        name: event.name,
        address: event.address,
        latitude: event.latitude,
        longitude: event.longitude,
        url: event.url,
        description: event.description,
        active: event.active,
        eventDate: event.eventDate,
        endTime: event.endTime,
        duration: event.duration,
        institution: event.institution,
        category: event.category,
        isPointsPerHour: event.isPointsPerHour,
        points: event.points,
        adHoc: event.adHoc,
        pointsPerHour: event.pointsPerHour
      });
    });
  }
});
