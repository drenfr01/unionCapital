// This function applies a regex to all specified fields
// The 3rd+ arguements are the fields to include in the search
// ex: Meteor.users.searchFor({}, 'sally', 'profile.firstName', 'profile.lastName', 'profile.partnerOrg')
function searchFor(selector, searchText, fields, options) {
  var out = this.find(selector, options).fetch();

  // Return all if no text included
  if (!searchText)
    return out;

  // Remove all non-alphanumeric characters
  var terms = searchText.replace(/\W/g,' ').trim().split(" ");
  var regExp = new RegExp("(?=.*" + terms.join(")(?=.*") + ")", 'i');

  // Retrieve all arguments past the first two
  // var fields = Array.prototype.slice.call(arguments,1);

  // For each document, concatenate all of the values from the specified fields and apply the regex
  return _.filter(out, function(doc) {
    var concatFields = '';
    _.each(fields, function(field) {
      concatFields += getFieldValue(doc,field);
    });
    return regExp.test(concatFields);
  });
}

function searchForOne(selector, searchText, fields, options) {
  var result = this.searchFor(selector, searchText, fields, options);

  if (result)
    return result[0];
}

// Untested....
function userMatches(args) {
  var thisSelector = args.thisSelector || {},
    searchText = args.searchText,
    searchFields = args.searchFields || [],
    userSelector = args.userSelector || {},
    idField = args.idField;

  var user;
  var out = this.find(thisSelector).fetch();

  // Return all if no text included
  if (!searchText)
    return out;

  // Remove all non-alphanumeric characters
  var terms = searchText.replace(/\W/g,' ').trim().split(" ");
  var regExp = new RegExp("(?=.*" + terms.join(")(?=.*") + ")", 'i');

  // For each document, concatenate all of the values from the specified fields and apply the regex
  return _.chain(out)
    .map(function(doc) {
      user = Meteor.users.findOne(doc.idField);
      return !!user ? _.extend(doc, { profile: user.profile }) : null;
    })
    .filter(function(doc) {
      if (!doc) return;

      var concatFields = '';
      _.each(fields, function(field) {
        concatFields += getFieldValue(doc,field);
      });
      return regExp.test(concatFields);
    })
    .value();

}

// Retrieves the values from an object from the string representation
// Created to handle nested fields (e.g. 'profile.firstName')
function getFieldValue(obj, fieldString) {
  try {
    return fieldString.split('.').reduce(index, obj);
  } catch(e) {
    return '';
  }
}

// Reduce function
function index(obj, i) {
  return obj[i];
}

// Add the search to the users and all normal collections
// Mongo.Collection.prototype.searchFor = searchFor;
// Mongo.Collection.prototype.searchForOne = searchForOne;
// Mongo.Collection.prototype.userMatches = userMatches;
Meteor.users.searchFor = searchFor;
Meteor.users.searchForOne = searchForOne;
