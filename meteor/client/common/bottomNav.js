// Define the html elements and classes based on the paramter passed here
var types = {

  submit: {
    type: 'submit',
    text: 'SUBMIT',
    icon: 'glyphicon glyphicon-ok',
    id: 'submit'
  },

  next: {
    type: 'button',
    text: 'NEXT',
    icon: 'glyphicon glyphicon-chevron-right',
    id: 'next'
  },

  // Submits the form but looks like next
  nextSubmit: {
    type: 'submit',
    text: 'NEXT',
    icon: 'glyphicon glyphicon-chevron-right',
    id: 'submit'
  },

  cancel: {
    type: '',
    text: '',
    icon: '',
    id: 'iAmNotAnId'
  },
  accept: {
    type: 'button',
    text: 'I ACCEPT',
    icon: 'glyphicon glyphicon-ok',
    id: 'next'
  }
}

Template.bottomNav.helpers({

  thisButtonType: function () {
    if(types[this.buttonType] !== null && types[this.buttonType] !== undefined)
      return types[this.buttonType].type;
    else
      return '';
  },

  thisButtonText: function () {
    if(types[this.buttonType] !== null && types[this.buttonType] !== undefined)
      return types[this.buttonType].text;
    else
      return '';
  },

  thisButtonIcon: function () {
    if(types[this.buttonType] !== null && types[this.buttonType] !== undefined)
      return types[this.buttonType].icon;
    else
      return '';
  },

  thisButtonId: function () {
    if(types[this.buttonType] !== null && types[this.buttonType] !== undefined)
      return types[this.buttonType].id;
    else
      return '';
  },

  notOnlyLeft: function() {
    return this.buttonType !== 'cancel';
  },

  leftClass: function() {
    if (this.buttonType === 'cancel')
      return 'only-left-nav';
    else
      return '';
  }

});
