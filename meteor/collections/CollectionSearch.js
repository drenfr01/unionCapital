// This function applies a regex to all specified fields
// The 3rd+ arguements are the fields to include in the search
// ex: Meteor.users.searchFor({}, 'sally', 'profile.firstName', 'profile.lastName', 'profile.partnerOrg')
function searchFor(selector, searchText) {
  var out = this.find(selector).fetch();

  // Return all if no text included
  if (!searchText)
    return out;

  // Remove all non-alphanumeric characters
  var terms = searchText.replace(/\W/g,' ').trim().split(" ");
  var regExp = new RegExp("(?=.*" + terms.join(")(?=.*") + ")", 'i');

  // Retrieve all arguments past the first two
  var fields = Array.prototype.slice.call(arguments,1);

  // For each document, concatenate all of the values from the specified fields and apply the regex
  return _.filter(out, function(doc) {
    var concatFields = '';
    _.each(fields, function(field) {
      concatFields += getFieldValue(doc,field);
    });
    return regExp.test(concatFields);
  });
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
Mongo.Collection.prototype.searchFor = searchFor;
Meteor.users.searchFor = searchFor;
