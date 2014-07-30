Meteor.startup(function () {
  console.log('Loading User data from Fixtures [Users, Events]');

  // Users fixture
  if ( Meteor.users.find().count() === 0 ) {
    var users = [
      {
         email: "admin@gmail.com", username: "admin", password: "admin",
         name: "admin", roles:['admin']
      },
      {
        email: "user@gmail.com", username: "user", password: "user", 
        profile: {
          firstName: 'Duncan',
          lastName: 'Renfrow',
          street: '10 Emerson',
          city: 'Boston',
          state: 'MA'
        },
        roles:['user']
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
  }
  //Events fixture
  if ( Events.find().count() === 0 ) {
    var events = [
      {
        name: 'Cambridge Science Festival',
        address: '1 Kendall Sq, Cambridge, MA',
        latitude: '42.3677845',
        longitude: '-71.0899675',
        url: 'http://example.com/CSF',
        description: 'A festival of science for everybody',
        active: 1,
        startDate: new Date(2014,6,6),
        endDate: new Date(2014,7,7),
        points: 50
      },
      {
        name: 'Somerville Cooking Festival',
        address: '189 Massachusetts Ave, Somerville, MA',
        latitude: '42.3453621',
        longitude: '-71.0871995',
        url: 'http://example.com/SCF',
        description: 'A festival of cooking for the masses',
        active: 1,
        startDate: new Date(),
        endDate: new Date(),
        points: 50
      },
      {
        name: 'Boston Music Festival',
        address: '26 Vassar St, Boston, MA',
        latitude: '42.2999257',
        longitude: '-71.0773658',
        url: 'http://example.com/BMF',
        description: 'Music festival; all styles - join us soon!',
        active: 1,
        startDate: new Date(2014,6,6),
        endDate: new Date(2014,8,8),
        points: 25
      },
      {
        name: 'Cambridge Film Festival',
        address: '18 Davis Sq, Somerville, MA',
        latitude: '42.3966813',
        longitude: '-71.1226578',
        url: 'http://example.com/CFF',
        description: 'Watch as many films as you can in just 3 days of mandness!',
        active: 1,
        startDate: new Date(2014,7,7),
        endDate: new Date(2014,8,8),
        points: 150
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
        startDate: event.startDate,
        endDate: event.endDate,
        points: event.points
      });
    });
  }
});
