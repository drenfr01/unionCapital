//Code taken from: http://stackoverflow.com/questions/17140483/how-do-i-reconfigure-meteors-accounts-facebook-or-where-is-meteors-facebook-c

//Note:
//To develop locally:  meteor --settings private/local-settings.json
//To deploy remotely: meteor deploy --settings private/prod-settings.json.

configureFacebook = function(config) {
  //first, remove configuration entry in case service is already configured
  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });

  ServiceConfiguration.configurations.insert({
    service: "facebook",
    loginStyle: "popup", //NOTE: changing to redirect causes bug right now
    appId: config.clientId,
    secret: config.secret
  });
};

// set the settings object with meteor --settings private/settings-local.json
var facebookConfig = Meteor.settings.facebook;
if(facebookConfig) {
      configureFacebook(facebookConfig);
      console.log('Got settings for facebook', facebookConfig);
}

Future = Npm.require('fibers/future');

Impersonate.admins = ['admin', 'partnerAdmin'];


// In the event of a bad deploy, this can be rolled back by changing this to:
// Migrations.migrateTo(<num>) where <num> is the db revision you want to migrate to
//Migrations.migrateTo('latest');
/*
console.log('Starting Migrations');
deleteUCBButtons();
console.log('Completed UCB Buttons');
changeMultipleOrgs();
console.log('Completed Multiple Orgs');
migrateCategories();
console.log('Completed migrate categories');
addPrivateEventsFlag();
console.log('Completed add private events flag');
*/
