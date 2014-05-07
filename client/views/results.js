Template.results.searchResults = function() {
  var keyword = Session.get("searchQuery");
  // TODO: Unit test this....
  if(!_.isUndefined(keyword) && !(keyword === "")){
    var query = new RegExp( keyword, 'i' );
    var results = Customers.find( { $or: [{'firstName': query},
                                         {'lastName': query},
                                         {'fullName': query}]
                                  },
                                  {limit: 5}
                                );
    return results.fetch();
  }
  return false;
};

Template.results.created = function() {
  Session.set("customerButtonClicked", false);
};

Template.results.addCustomerClicked = function() {
  return Session.get("customerButtonClicked");
};

Template.results.events({
  'click .customerNames': function(e) {
    //TODO: this feels a little hacky...basically manually resetting input
    //TODO: also we duplicate this code here in addCustomerForm.js
    $('#customerSearch').val("");
    Session.set('searchQuery', "");
    Session.set("customerButtonClicked", false);
  }
});
