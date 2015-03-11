SearchSource.defineSource('partnerOrgSearch', function(searchText, options){
    var options = {
      sort: {name: 1},
      limit: 20
    };

    if(searchText && searchText.length > 0) {
      var regExp = buildRegExp(searchText);
      var selector = {name: regExp};
      return PartnerOrgs.find(selector, options).fetch();
    } else {
      return PartnerOrgs.find({}).fetch();
    }
    
});

function buildRegExp(searchText) {
  var parts = searchText.trim().split(' ');
  // note that \\s intrepets to \s, a single whitespace character
  return new RegExp("(" + parts.join("\\s") + ")", "ig");
}
