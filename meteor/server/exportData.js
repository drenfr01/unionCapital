//var jsZip = Meteor.npmRequire('jszip');
//var fastCsv = Meteor.npmRequire('fast-csv');

helperFlattenProfile = function (members) {
  return _.map(members, function(profile) {
    return profile.profile;
  });
};

exportAsCSV = function(zip, collection, fileName, done) {
  var csv = fastCsv;
  csv.writeToString(collection, {
    headers: true
  }, function(error, data) {
    if (error) {
      return console.log(error);
    } else {
      zip.file(fileName, data);
    }
    done(error,null);
  });
};

Meteor.methods({
  exportMembers: function(userId) {
    check(userId, String);
    var user = Meteor.users.findOne(userId);
    var selector;
    //make sure only superAdmin can export unrestricted data 
    if (_.contains(user.roles, 'admin')) {
      selector = {roles: {$in: ["user"]}};
    } else {
      selector = {roles: {$in: ["user"]}, "profile.partnerOrg": user.profile.partnerOrg};
    }
    var zip = new jsZip();

    var members = Meteor.users.find(selector, {
      fields: {
        profile: 1
      }
    }).fetch();

    var memberProfiles = helperFlattenProfile(members);
    
    //Note: can also implement export as HTML, JSON, & XML
    var response = Async.runSync(function(done) {
        exportAsCSV(zip, memberProfiles, 'members.csv', done);
    });

    // TODO, throw error if csv is empty so that we can catch if the csv export breaks
    return zip.generate({type: "base64"});
  },
  exportPartnerOrgs: function(userId) {
    check(userId, String);
    var user = Meteor.users.findOne(userId);
    var zip = new jsZip();
    //make sure only superAdmin can export data 
    if (!_.contains(user.roles, 'admin')) {
      return zip.generate({type: "base64"});
    } else {

      var partnerOrgs = PartnerOrgs.find({}, {
        fields: {
          _id: 0
        }
      }).fetch();

      //Note: can also implement export as HTML, JSON, & XML
      var response = Async.runSync(function(done) {
        exportAsCSV(zip, partnerOrgs, 'partnerOrgs.csv', done);
      });

      // TODO, throw error if csv is empty so that we can catch if the csv export breaks
      return zip.generate({type: "base64"});
    }
  },
  exportEvents: function(userId) {
    check(userId, String);
    var user = Meteor.users.findOne(userId);
    var selector = {};
    //make sure only superAdmin can export unrestricted data 
    if (!_.contains(user.roles, 'admin')) {
      selector = {institution: user.profile.partnerOrg};
    } 
    var zip = new jsZip();

    var events = Events.find(selector, {
      fields: {
        _id: 0
      }
    }).fetch();

    //Note: can also implement export as HTML, JSON, & XML
    var response = Async.runSync(function(done) {
      exportAsCSV(zip, events, 'events.csv', done);
    });

    // TODO, throw error if csv is empty so that we can catch if the csv export breaks
    return zip.generate({type: "base64"});
  }
});

