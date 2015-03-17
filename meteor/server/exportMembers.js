var jsZip = Meteor.npmRequire('jszip');
var fastCsv = Meteor.npmRequire('fast-csv');

//export data security will be based on userId
//so we'll look at the userId, determine your role
//then proceed from there
Meteor.methods({
  exportData: function(userId) {
    check(userId, String);
    var zip = new jsZip();

    var members = Meteor.users.find({roles: {$in: ["user"]}}, {
      fields: {
        profile: 1
      }
    }).fetch();

    var memberProfiles = helperFlattenProfile(members);

    var exportMembersAsCSV = function(done) {
      var csv = fastCsv;
      csv.writeToString(memberProfiles, {
        headers: true
      }, function(error, data) {
        if (error) {
          return console.log(error);
        } else {
          zip.file('members.csv', data);
        }
        done(error,null);
      });
    };

    //Note: can also implement export as HTML, JSON, & XML
    var response = Async.runSync(function(done) {
        exportMembersAsCSV(done);
    });

    // TODO, throw error if csv is empty so that we can catch if the csv export breaks
    return zip.generate({type: "base64"});
  }
});

helperFlattenProfile = function (members) {
  return _.map(members, function(profile) {
    return profile.profile;
  });
}
