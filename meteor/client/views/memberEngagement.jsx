const MemberEngagement = React.createClass({
  render: function() {
    return <div>Hello</div>;
  },
});

Template.memberEngagement.helpers({
  MemberEngagement: function() {
    return MemberEngagement;
  },
});