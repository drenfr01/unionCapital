var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};

var fields = ['name'];

PartnerOrgSearch = new SearchSource('partnerOrgSearch', fields, options);

var getOrgData = function() {
  return PartnerOrgSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<span style='color:red'>$&</span>");
    },
    sort: {name: 1}
  });
};

Template.partnerOrgs.rendered = function() {
  PartnerOrgSearch.search("");
};

Template.partnerOrgs.helpers({
  partnerOrgs: function() {
    return getOrgData();
  }
});

Template.partnerOrgs.events({
  'click #partnerAdminUsers': function(e) {
    e.preventDefault();
    Router.go('partnerAdminView');
  },
  'click #addPartnerOrg': function(e) {
    e.preventDefault();
    Router.go('addPartnerOrg');
  },
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PartnerOrgSearch.search(text);
  }, 200)
});
