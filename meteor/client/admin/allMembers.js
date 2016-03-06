var options = {
  keepHistory: 1,
  localSearch: false
};

var fields = ['profile.firstName', 'profile.lastName'];

Session.set('sortOrder', -1);
Session.set('sortOn', 'points');
var searchText = new ReactiveVar('');


Template.allMembers.onCreated(function() {
  var template = this;
  template.autorun(function() {
    var skipCount = (currentPage() - 1) * AppConfig.public.recordsPerPage;
    template.subscribe('userData', skipCount, Session.get('sortOn'), 
                       Session.get('sortOrder'));
  });
});

Template.allMembers.onRendered(function() {
  this.$('#points').css('color', 'red');
  searchText.set('');
});

Template.allMembers.helpers({
  getMembers: function() {
    return getMembersData(Session.get('sortOn'), Session.get('sortOrder'));
  },
  prevPage: function() {
    var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
    return Router.routes.allMembers.path({page: previousPage});
  },
  nextPage: function() {
    var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
    return Router.routes.allMembers.path({page: nextPage});
  },
  prevPageClass: function() {
    return currentPage() <= 1 ? "disabled" : "";
  },
  nextPageClass: function() {
    return hasMorePages() ? "" : "disabled";
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
  'click #transCount': function(e) {
    Session.set('sortOn', 'transCount');
    highlightSortedColumn(e.target);
  },
  "click #points": function(e) {
    Session.set('sortOn', 'points');
    highlightSortedColumn(e.target);
  },
  'click #lastEventName': function(e) {
    Session.set('sortOn', 'lastEventName');
    highlightSortedColumn(e.target);
  },
  'click #lastTransDate': function(e) {
    Session.set('sortOn', 'lastTransDate');
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
  'click #clearBtn': function(e) {
    e.preventDefault();
    searchText.set('');
    $('#search-box').val('');
    $('#search-box').focus();
  },
});

var hasMorePages = function() {
  var totalMembers = Counts.get('userCount');
  return currentPage() * parseInt(AppConfig.public.recordsPerPage) < totalMembers;
}

var currentPage = function() {
  return parseInt(Router.current().params.page) || 1;
}
var highlightSortedColumn = function(target) {
    $(".tableSort").css('color', 'black');
    $(target).css('color','red');
};

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
  var tableRows = _.map(users, function(user) {

    var totalPoints = Meteor.users.totalPointsFor(user._id);

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
      lastEvent: userProfile.lastEventName || "",
      lastEventDate: userProfile.lastTransDate || "",
      numberOfTransactions: userProfile.transCount || 0,
      totalPoints: totalPoints};
  });

  return tableRows;
}
