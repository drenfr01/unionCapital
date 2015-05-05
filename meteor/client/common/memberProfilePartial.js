Template.memberProfilePartial.helpers({
  memberProfile: function() {
    return this.profile;
  },
  memberEmail: function() {
    return this.emails[0].address;
  }
});
