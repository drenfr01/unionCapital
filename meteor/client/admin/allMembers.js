var options = {
  keepHistory: 1000 * 60 * 5,
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

var getMembersData = function(sortOn, sortOrder) {
  var membersArray = MemberNameSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>");
    },
    sort: {sortOn: sortOrder}
  });
  //HACK: couldn't figure out how to get Search-Source to
  //sort client side reatively in above getData.sort object
  if(sortOrder === 1) { //ascending order
    return _.sortBy(membersArray, sortOn);
  } else { //descending order
    return _.sortBy(membersArray, sortOn).reverse();
  }
};

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
    var text = $(e.target).val().trim();
    MemberNameSearch.search(text);
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
  }
});
