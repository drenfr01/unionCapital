Template.results.created = function() {
  Session.set("memberButtonClicked", false);
};

Template.results.helpers({
  'searchResults':  function() {
    var keyword = Session.get("searchQuery");
    // TODO: Unit test this....
    if(!_.isUndefined(keyword) && !(keyword === "")){
      var query = new RegExp( keyword, 'i' );
      var results = Meteor.users.find({$or: [{'emails[0].address': query},
                                            {username: query} ]
                                      },
                                       {limit: 5}
                                  );
      return results.fetch();
    }
    return false;
  },
  'addCustomerClicked': function() {
    return Session.get("memberButtonClicked");
  }
});


Template.results.events({
  'click .memberNames': function(e) {
    //TODO: this feels a little hacky...basically manually resetting input
    //TODO: also we duplicate this code here in addCustomerForm.js
    $('#memberSearch').val("");
    Session.set('searchQuery', "");
    Session.set("memberButtonClicked", false);
  }
});
