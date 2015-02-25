var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};

var fields = ['profile.firstName', 'profile.lastName'];

MemberNameSearch = new SearchSource('memberSearch', fields, options);

Template.allMembers.helpers({
  getMembers: function() {
    return MemberNameSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>");
      },
      sort: {"profile.firstName": -1}
    });
  }
});

Template.allMembers.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    MemberNameSearch.search(text);
  }, 200)
});
