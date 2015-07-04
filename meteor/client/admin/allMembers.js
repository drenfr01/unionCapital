var options = {
  keepHistory: 1,
  localSearch: false
};

var fields = ['profile.firstName', 'profile.lastName'];

Session.set('sortOrder', -1);
Session.set('sortOn', 'totalPoints');

var highlightSortedColumn = function(target) {
    $(".tableSort").css('color', 'black');
    $(target).css('color','red');
};

var searchText = new ReactiveVar('');

function getMembersData(sortOn, sortOrder) {
  //I think we overwrite options because there is both a server side and client side def
  //of this method, so it either calls the client side or after the timeout
  //does the server side
  var options = {
    limit: 1000
  };
  var currentUser = Meteor.user();
  var fields = ['profile.firstName', 'profile.lastName', 'profile.partnerOrg'];
  var selector = { deleteInd: false };

  // Restrict to only user-level accounts from own org if partner admin
  // Should be restricted in pub as well, this is just a safety net
  if(Roles.userIsInRole(Meteor.userId(), 'partnerAdmin')) {
    selector['profile.partnerOrg'] = currentUser.profile.partnerOrg;
    selector.roles = { $all: ['user'] };
  }

  var users = Meteor.users.searchFor(selector, searchText.get(), fields, options);
  var userIds = _.pluck(users, '_id');
  //improves from 17s to 9s, still crappy though
  var allTransactions = Transactions.find({userId: {$in: userIds}, approved: true,
                                          eventId: {$exists: true}}).fetch();
  var events = Events.find().fetch();

  var tableRows = _.map(users, function(user) {

    //TODO: this is broken, doesn't return last transaction
    var userTransactions = _.where(allTransactions, {userId: user._id});
    var transactionCount = userTransactions.length;
    var mostRecentTransaction = userTransactions[0] || { eventId: "", transactionDate: ""};
    var mostRecentEvent = _.findWhere(events, {eventId: mostRecentTransaction.eventId}) || {name: ""};

    var totalPoints = 0;
    if(!_.isEmpty(userTransactions)) {
      totalPoints = _.reduce(userTransactions, function(sum, transaction) {
        var event = _.findWhere(events, {_id: transaction.eventId});
        if(event && event.isPointsPerHour) {
          return Math.round(sum += event.pointsPerHour * transaction.hoursSpent);
        } else if(event) {
          return sum += event.points;
        }
      },0);
    }

    //if user is admin
    var userProfile = user.profile || {firstName: 'admin', lastName: 'd', zip: ''};
    //if user is logging in with facebook
    var userFirstName = userProfile.firstName || userProfile.name || "";
    var userLastName = userProfile.lastName || userProfile.name || "";
    var userZip = userProfile.zip || "";

    return {
      memberId: user._id,
      firstName: userFirstName,
      lastName: userLastName,
      zip: userZip,
      lastEvent: mostRecentEvent.name,
      lastEventDate: mostRecentTransaction.transactionDate,
      numberOfTransactions: transactionCount,
      totalPoints: totalPoints};
  });

  if (Session.get('sortOrder') === -1)
    return _.sortBy(tableRows, Session.get('sortOn')).reverse();
  else
    return _.sortBy(tableRows, Session.get('sortOn'));
}

Template.allMembers.rendered = function() {
  highlightSortedColumn("#" + Session.get('sortOn'));
  searchText.set('');
};

Template.allMembers.helpers({
  getMembers: function() {
    console.time("function 1");
    var data = getMembersData(Session.get('sortOn'), Session.get('sortOrder'));
    console.timeEnd("function 1");
    return data;
  }
});

// TODO: This should be refactored to a single click handler on the parent element
// using data attributes as the set value
// Should also set it to allow users to click twice to reverse the ordering
Template.allMembers.events({
  "keyup #search-box": _.throttle(function(e) {
    searchText.set($(e.target).val().trim());
  }, 200),
  'click #firstName': function(e) {
    Session.set('sortOn', 'firstName');
    highlightSortedColumn(e.target);
  },
  'click #zip': function(e) {
    Session.set('sortOn', 'zip');
    highlightSortedColumn(e.target);
  },
  'click #transactions': function(e) {
    Session.set('sortOn', 'numberOfTransactions');
    highlightSortedColumn(e.target);
  },
  'click #totalPoints': function(e) {
    Session.set('sortOn', 'totalPoints');
    highlightSortedColumn(e.target);
  },
  'click #lastEvent': function(e) {
    Session.set('sortOn', 'lastEvent');
    highlightSortedColumn(e.target);
  },
  'click #lastEventDate': function(e) {
    Session.set('sortOn', 'lastEventDate');
    highlightSortedColumn(e.target);
  },
  'change .radio-inline': function(e) {
    if(e.target.value === "ascending") {
      Session.set('sortOrder',1);
    } else {
      Session.set('sortOrder', -1);
    }
  },
  'click .memberRow': function(e) {
    e.preventDefault();
    Router.go('viewMemberProfile', {_id: this.memberId});
  },
  'click #clearBtn': function() {
    $('#search-box').val('');
    $('#search-box').focus();
  },
});
