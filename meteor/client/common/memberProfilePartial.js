Template.memberProfilePartial.helpers({
  memberProfile: function() {
    return _.extend(this.profile, {emailAddress: this.emails[0].address});
  }
});
