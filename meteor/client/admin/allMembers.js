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

Template.allMembers.rendered = function() {
  MemberNameSearch.search("");
  highlightSortedColumn("#" + Session.get('sortOn'));
};

Template.allMembers.helpers({
  getMembers: function() {
    var sortOn = function() {return Session.get("sortOn"); };
    var sortOrder = function() {return Session.get("sortOrder"); };
    return MemberNameSearch.getData({
      transform: function(matchText, regExp) {
        console.log(sortOn);
        return matchText.replace(regExp, "<b>$&</b>");
      },
      sort: {sortOn: sortOrder}
    });
  }
});

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
  }
});
