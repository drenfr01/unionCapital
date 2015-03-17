var jsZip = Meteor.npmRequire('jszip');
var fastCsv = Meteor.npmRequire('fast-csv');

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

//export data security will be based on userId
//so we'll look at the userId, determine your role
//then proceed from there
Meteor.methods({
  exportMembers: function(userId) {
    check(userId, String);
    var zip = new jsZip();

    var members = Meteor.users.find({roles: {$in: ["user"]}}, {
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
  }
});

