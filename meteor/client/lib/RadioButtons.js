RadioButtons = function(selector, defaultId) {
  this.buttonDiv = $(selector);
  this.selector = selector;

  $(selector + '.radioLink').removeClass('radio-active');
  $('#' + defaultId).addClass('radio-active');
}

RadioButtons.prototype.setActive = function(thisId) {
  var self = this;

  $(selector + '.radioLink').removeClass('radio-active');
  $('#' + thisId).addClass('radio-active');
}