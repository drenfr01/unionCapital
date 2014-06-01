Meteor.startup(function () {
  console.log('Loading User data from Fixtures [Users, Events]');

  // Users fixture
  if ( Meteor.users.find().count() === 0 ) {
    var users = [
      {
         email: "admin@gmail.com", username: "admin", password: "admin", name: "admin"
      },
      {
         email: "user@gmail.com", username: "user", password: "user", name: "user"
      }
    ];

    _.each(users, function(user){
      Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: {username: user.username},
        profile: {name: user.name}
      });
    });
  }

  //Events fixture
  if ( Events.find().count() === 0 ) {
    var events = [
      {
        name: 'Cambridge Science Festival',
        address: '1 Kendall Sq',
        description: 'A festival of science for everybody',
        active: 1,
        startDate: new Date(),
        endDate: new Date(),
        points: 50
      },
      {
        name: 'Somerville Cooking Festival',
        address: '189 Mass Ave',
        description: 'A festival of cooking for the masses',
        active: 1,
        startDate: new Date(),
        endDate: new Date(),
        points: 50
      },
      {
        name: 'Boston Music Festival',
        address: '26 Vassar St',
        description: 'Music festival; all styles - join us soon!',
        active: 1,
        startDate: new Date(),
        endDate: new Date(),
        points: 25
      },
      {
        name: 'Cambridge Film Festival',
        address: '18 Davis Sq',
        description: 'Watch as many films as you can in just 3 days of mandness!',
        active: 1,
        startDate: new Date(),
        endDate: new Date(),
        points: 150
      }
    ];

    _.each(events, function(event){
      Events.insert({
        name: event.name,
        address: event.address,
        description: event.description,
        active: event.active,
        startDate: event.startDate,
        endDate: event.endDate,
        points: event.points
      });
    });
  }

});
