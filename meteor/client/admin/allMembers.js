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
  //get all transactions and events ahead of time
  //maybe build a hash of stuff?
  var userIds = _.pluck(users, "_id");
  var allTransactions = Transactions.find({userId: {$in: userIds }},
                                         {sort: {transactionDate: -1}}).fetch();
 
  var eventIds = _.pluck(allTransactions, "eventId");
  var allEvents = Events.find({_id: {$in: eventIds}}).fetch();
  
  //TODO: THE BELOW CODE SNIPPET IS AN OFFENSE TO GOD AND MEN
  var tableRows = _.map(users, function(user) {

    //WARNING: unclear if below is a big performance hit (2 cursor calls)
    var transactions = _.filter(allTransactions, function(trans) {
      return trans.userId === user._id;
    });
    var transactionCount = transactions.length;
    var totalPoints = 0;
    var eventIds = _.pluck(transactions, "eventId");

    //var events = Events.find({_id: {$in: eventIds}}).fetch();
    var events = _.filter(allEvents, function(event) {
      return eventIds.indexOf(event._id) > -1;
    });
    _.each(transactions, function(transaction) {
      var event = _.findWhere(events, {_id: transaction.eventId});
      if(event && event.isPointsPerHour) {
        totalPoints = Math.round(totalPoints + 
                                 (event.pointsPerHour * transaction.hoursSpent));
      } else if(event) {
        totalPoints += event.points;
      }
    });
    var mostRecentTransaction = transactions[0] ||
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
      firstName: userFirstName,
      lastName: userLastName,
      zip: userZip,
      lastEvent: mostRecentEvent.name,
      lastEventDate: mostRecentTransaction.transactionDate,
      numberOfTransactions: transactionCount,
      totalPoints: totalPoints};
  });

  var out = _.sortBy(tableRows, function(item) {
    var sortField = item[Session.get('sortOn')];
    if (typeof sortField === 'number' || typeof sortField === 'date')
      return sortField;
    else
      return sortField.toLowerCase();
  });

  if (Session.get('sortOrder') === -1)
    return out.reverse();
  else
    return out;
}

Template.allMembers.rendered = function() {
  highlightSortedColumn("#" + Session.get('sortOn'));
  searchText.set('');
};

Template.allMembers.helpers({
  getMembers: function() {
    console.time('all members');
    var data = getMembersData(Session.get('sortOn'), Session.get('sortOrder'));
    console.timeEnd('all members');
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
