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
    appId: config.clientId,
    secret: config.secret
  });
};

// set the settings object with meteor --settings private/settings-local.json
var facebookConfig = Meteor.settings.facebook;
if(facebookConfig) {
      console.log('Got settings for facebook', facebookConfig);
      configureFacebook(facebookConfig);
}

Future = Npm.require('fibers/future');
