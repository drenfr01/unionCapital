Template.layout.events({
  'click .container-fluid': uiHelpers.closeNavDropdown
});

Template.layout.helpers({
	isLoggedIn: function () {
		return Meteor.user() ? 'logged-in' : 'logged-out';
	}
});