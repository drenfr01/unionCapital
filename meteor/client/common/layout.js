Template.layout.events({
});

Template.layout.helpers({
	isLoggedIn: function () {
		return Meteor.user() ? 'logged-in' : 'logged-out';
	}
});