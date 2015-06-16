var options = {
  keepHistory: 1,
  localSearch: false
};

var fields = ['profile.firstName', 'profile.lastName'];

MemberNameSearch = new SearchSource('memberSearch', fields, options);

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
    sort: {"profile.firstName": Session.get('sortOrder') },
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
}

function buildRegExp(searchText) {
  var name = searchText.trim().split(" ");
  return new RegExp("(" + name.join('|') + ")", 'ig');
}

Template.allMembers.rendered = function() {
  MemberNameSearch.search("");
  highlightSortedColumn("#" + Session.get('sortOn'));
};

Template.allMembers.helpers({
  getMembers: function() {
    return getMembersData(Session.get('sortOn'), Session.get('sortOrder'));
  }
});

//TODO: have each change try to re-render members?
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
    MemberNameSearch.search('');
    $('#search-box').val('');
    $('#search-box').focus();
  },
});
