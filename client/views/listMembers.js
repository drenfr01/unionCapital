Session.set('sortOn', 'totalPoints');
//1 = ascending, -1 = descending
Session.set('sortOrder', -1);
Session.set('results', null);

Tracker.autorun(function() {
    var attributes = {
      sortOn: Session.get('sortOn'),
      sortOrder: Session.get('sortOrder')
    };

    Meteor.call('insertMemberData', attributes, function(error,data) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        Session.set('results', data);
      }
    });
});

var highlightSortedColumn = function(target) {
    console.log(target);
    $(".tableSort").css('color', 'black');
    $(target).css('color','red');
};

Template.listMembers.rendered = function() {
  highlightSortedColumn("#" + Session.get('sortOn'));
};


Template.listMembers.helpers({
  'members': function() {
    return Session.get('results');
  }
});

Template.listMembers.events({
  'click #firstName': function(e) {
    console.log(e.target);
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
