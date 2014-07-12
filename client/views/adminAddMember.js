Template.results2.created = function() {
  Session.set("memberButtonClicked", false);
};

Template.results2.helpers({
  'addCustomerClicked': function() {
    return Session.get("memberButtonClicked");
  }
});


Template.results2.events({
  'click .memberNames': function(e) {
    //TODO: this feels a little hacky...basically manually resetting input
    //TODO: also we duplicate this code here in addCustomerForm.js
    $('#memberSearch').val("");
    Session.set('searchQuery', "");
    Session.set("memberButtonClicked", false);
    Session.set("memberProfileSelected", false);
    Session.set('selectedMemberId', this._id);
  }
});
