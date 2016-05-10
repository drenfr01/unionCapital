Template.userTemplate.helpers({
  email: function() {
    if(this && this.emails[0]) {
      return this.emails[0].address; 
    } else {
      return 'No Email';
    }
  }
})
