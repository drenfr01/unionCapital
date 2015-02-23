//Want to have array to control number of hours (returns 0-8)
Template.timeSelection.helpers({
  'hours': function() {
    return [0,1,2,3,4,5,6,7,8];
  },
  'minutes': function() {
    return [0,15,30,45];
  }
});
