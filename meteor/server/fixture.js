Meteor.startup(function () {
  //Seeding Partner Org Sectors
  if(PartnerOrgSectors.find().count() === 0) {
    var sectors = [
      'Children',
      'Job Training',
      'Shelter',
      'Other'
    ];

    _.each(sectors, function(sector) {
      PartnerOrgSectors.insert({name: sector, deleteInd: false});
    });
  }

  //Seeding Partner Organizations
  if(PartnerOrgs.find().count() === 0 && Meteor.settings.env === 'dev') {
    var partnerOrgs = [
      {name: "KIPP Academy", sector: "Children", membersReported: 50, deleteInd: false},
      {name: "Thrive in Five", sector: "Job Training", membersReported: 50, deleteInd: false},
      {name: "Rosie's Place", sector: "Shelter", membersReported: 50, deleteInd: false},
      {name: "Other", sector: "Other", membersReported: 50, deleteInd: false}
    ];

    _.each(partnerOrgs, function(org) {
      PartnerOrgs.insert(org);
    });
  }

  //Seeding Income Brackets
  if(IncomeBrackets.find().count() === 0) {
    var incomeBrackets = [
      "0-9,999",
      "10,000-19,999",
      "20,000-24,999",
      "25,000-29,999",
      "30,000-39,999",
      "40,000-49,999",
      "50,000+"
    ];

    _.each(incomeBrackets, function(bracket) {
      IncomeBrackets.insert({bracket: bracket, deleteInd: false});
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
      '6',
      '7',
      '8',
      '9',
      '10+'
    ];

    _.each(kids, function(kid) {
      Kids.insert({number: kid, deleteInd: false});
    });
  }

  //Seeding Number of People for Reservations
  if(NumberOfPeople.find().count() === 0) {
    var people = [
      '0',
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
  //Seeding Races
  if(Races.find().count() === 0) {
    var races = [
      'African-American or Black',
      'White',
      'Alaskan Native or American Indian',
      'Asian',
      'Hawaiian Native or Pacific Islander',
      'Other',
      '2+ Races'
    ];

    _.each(races, function(race) {
      Races.insert({name: race, deleteInd: false});
    });
  }
  //Seeding Ethnicities
  if(Ethnicities.find().count() === 0) {
    var ethnicities = [
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

    _.each(ethnicities, function(ethnicity) {
      Ethnicities.insert({name: ethnicity, deleteInd: false});
    });
  }
  //Seeding event categories
  if(EventCategories.find().count() === 0) {
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

  //Seeding affiliate organizations
  if(EventOrgs.find().count() === 0 && Meteor.settings.env === 'dev') {
    var organizations =
      [ 'Other',
        'BMC Health Net Plan',
        'Codman Academy',
        'Codman Health Center',
        'FII',
        'KIPP Boston',
        'Nurtury',
        'Thrive in 5'
    ];

    _.each(organizations, function(organization) {
      EventOrgs.insert({organization: organization});
    });
  }

  // Users fixture
  if ( Meteor.users.find().count() === 0 && Meteor.settings.env === 'dev') {
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
          partnerOrg: "KIPP Academy",
          incomeBracket: "25,000-29,999",
          numberOfKids: "2",
          race: "African-American or Black"
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
          partnerOrg: "KIPP Academy",
          incomeBracket: "20,000-24,999",
          numberOfKids: "4",
          race: "White"
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
          partnerOrg: "Thrive in Five",
          incomeBracket: "0-9,999",
          numberOfKids: "1",
          race: "White"
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
          partnerOrg: "KIPP Academy"
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
  if ( Meteor.settings.env === 'dev' ) {
    //NOTE: months are 0 based for dates
    var events = [
      {
        name: 'Cambridge Science Festival',
        address: '1 Kendall Sq, Cambridge, MA',
        latitude: '42.3677845',
        longitude: '-71.0899675',
        url: 'http://example.com/CSF',
        description: 'A festival of science for everybody',
        active: 1,
        eventDate: addDays(new Date(), 7),
        institution: "KIPP Academy",
        category: "Education (Child/Adult)",
        isPointsPerHour: true,
        pointsPerHour: 100,
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
        eventDate: addDays(new Date(), -7),
        institution: "Thrive in Five",
        category: "Health (Physical & Mental)",
        isPointsPerHour: false,
        points: 50,
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
        eventDate: new Date(),
        institution: "KIPP Academy",
        category: "Education (Child/Adult)",
        isPointsPerHour: true,
        pointsPerHour: 100,
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
        eventDate: addDays(new Date(), 1),
        institution: "Thrive in Five",
        category: "Education (Child/Adult)",
        isPointsPerHour: false,
        points: 150,
        deleteInd: false
      },
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
        institution: "Other",
        category: "Other",
        isPointsPerHour: true,
        pointsPerHour: 100,
        deleteInd: false
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
        institution: event.institution,
        category: event.category,
        isPointsPerHour: event.isPointsPerHour,
        points: event.points,
        pointsPerHour: event.pointsPerHour
      });
    });
  }
});
