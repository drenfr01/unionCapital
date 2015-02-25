SearchSource.defineSource('memberSearch', function(searchText, options) {
  try {
    //TODO: why do we overwrite options here? it's a parameter above, but
    //yet this is the way it's done in the docs...
    //I think this is done because you there is both 
    //a server side and client side def of this method, 
    //so it either calls the client side or after the timeout
    //does the server side 
    var options = {
      sort: {"profile.firstName": 1},
      limit: 20
    };
    if(searchText) {
      var regExp = buildRegExp(searchText);
      var selector = {$or: [
        {"profile.firstName": regExp},
        {"profile.lastName": regExp}
      ]};
      return Meteor.users.find(selector, options).fetch();
    } else {
      return [];
    }
  } catch(e) {
    console.log(e.reason);
  }
});

function buildRegExp(searchText) {
  var name = searchText.trim().split(" ");
  return new RegExp("(.*" + name.join('.*|.*') + ".*)", 'ig');
}
