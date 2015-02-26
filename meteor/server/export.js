var jsZip = Meteor.npmRequire('jszip');
var fastCsv = Meteor.npmRequire('fast-csv');

//export data security will be based on userId
//so we'll look at the userId, determine your role
//then proceed from there
Meteor.methods({
  exportData: function(userId) {
    check(userId, String);
    var zip = new jsZip();
    var assetsFolder = zip.folder("assets");

    var getMembers = Meteor.users.find({roles: {$in: ["user"]}}, {
      "profile.firstName": 1,
      "profile.lastName": 1,
      "profile.street1": 1,
      "profile.street2": 1,
      "profile.city": 1,
      "profile.state": 1,
      "profile.zip": 1,
      "partnerOrg": 1,
      "incomeBracket": 1,
      "numberOfKids": 1,
      "race": 1
    }).fetch();

    var exportMembersAsCSV = function() {
      var csv = fastCsv;
      csv.writeToString(getMembers, {
        headers: true
      }, function(error, data) {
        if (error) {
          return console.log(error);
        } else {
          zip.file('members.csv', data);
        }
      });
    };
 
    //Note: can also implement export as HTML, JSON, & XML
    exportMembersAsCSV();

    return zip.generate({type: "base64"});
  }
});
