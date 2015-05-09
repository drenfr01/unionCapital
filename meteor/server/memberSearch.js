SearchSource.defineSource('memberSearch', function(searchText, options) {
  try {
    //I think we overwrite options because there is both a server side and client side def
    //of this method, so it either calls the client side or after the timeout
    //does the server side
    var options = {
      sort: {"profile.firstName": 1},
      limit: 20
    };
    var users = [];
    var currentUser = Meteor.user();
    var selector;


    //TODO: the code below isn't very DRY, I think there's
    //a simpler way and this should be refactored
    if(searchText && searchText.length > 0) {
      var regExp = buildRegExp(searchText);
      //restrict users based on role
      if (Roles.userIsInRole(this.userId, 'admin')) {
        selector = {$or: [
          {"profile.firstName": regExp},
          {"profile.lastName": regExp}
        ]};
      } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {
        selector = {
          "profile.partnerOrg": currentUser.profile.partnerOrg,
          "roles": "user",
          $or: [
          {"profile.firstName": regExp},
          {"profile.lastName": regExp}
        ]};
      }
      else {
        //should never reach here, if you aren't a superAdmin or partnerAdmin
        //you shouldn't have access to this search
        return;
      }
      users = Meteor.users.find(selector, options).fetch();
    } else {
      if (Roles.userIsInRole(this.userId, 'admin')) {
        selector = {};
      } else if(Roles.userIsInRole(this.userId, 'partnerAdmin')) {
        selector = {
          "profile.partnerOrg": currentUser.profile.partnerOrg,
          "roles": "user"
        };
      }
      else {
        //should never reach here, if you aren't a superAdmin or partnerAdmin
        //you shouldn't have access to this search
      }
      users = Meteor.users.find(selector, options).fetch();
    }

      //TODO: THE BELOW CODE SNIPPET IS AN OFFENSE TO GOD AND MEN
      var tableRows = _.map(users, function(user) {

      //WARNING: unclear if below is a big performance hit (2 cursor calls)
      var transactionCount = Transactions.find({userId: user._id}).count();
      var totalPoints = Meteor.users.totalPointsFor(user._id);
      var mostRecentTransaction = Transactions.find({userId: user._id},
                            {sort: {transactionDate: -1}, limit: 1}).fetch()[0] ||
                              { eventId: "", transactionDate: ""};
      var mostRecentEvent = Events.findOne(mostRecentTransaction.eventId) || {name: ""};

      //if user is admin
      var userProfile = user.profile || {firstName: 'admin', lastName: 'd', zip: ''};
      //if user is logging in with facebook
      var userFirstName = userProfile.firstName || userProfile.name || "";
      var userLastName = userProfile.lastName || userProfile.name || "";
      var userZip = userProfile.zip || "";



      return {
        memberId: user._id,
        firstName: userFirstName.toLowerCase(),
        lastName: userLastName.toLowerCase(),
        zip: userZip,
        lastEvent: mostRecentEvent.name,
        lastEventDate: mostRecentTransaction.transactionDate,
        numberOfTransactions: transactionCount,
        totalPoints: totalPoints};
    });

    return tableRows;
  } catch(e) {
    console.log(e);
  }
});

function buildRegExp(searchText) {
  var name = searchText.trim().split(" ");
  return new RegExp("(" + name.join('|') + ")", 'ig');
}
