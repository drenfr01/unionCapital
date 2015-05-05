Template.memberProfilePartial.rendered = function() {
  self = this;
};

Template.memberProfilePartial.helpers({
  memberProfile: function() {
    return self.profile;
  },
  memberEmail: function() {
    debugger;
    return self.emails[0].address;
  }
});
