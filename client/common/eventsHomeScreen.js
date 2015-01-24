//Correct Timezone support
Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});

Template.eventsHomeScreen.rendered = function(){
  $('#eventDate').val(new Date().toDateInputValue()); 
};

Template.eventsHomeScreen.helpers({
});
