var jsZip = Meteor.npmRequire('jszip');
var fastCsv = Meteor.npmRequire('fast-csv');

//export data security will be based on userId
//so we'll look at the userId, determine your role
//then proceed from there
Meteor.methods({
  exportData: function(userId) {
    check(userId, String);
    var zip = new jsZip();

    var getMembers = Meteor.users.find({roles: {$in: ["user"]}}, {
      fields: {
        profile: 1
      }
    }).fetch();

    var getMemberProfiles = _.map(getMembers, function(profile) {
      return profile.profile;
    });


    var exportMembersAsCSV = function(done) {
      var csv = fastCsv;
      csv.writeToString(getMemberProfiles, {
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
    
    return zip.generate({type: "base64"});
  }
});
