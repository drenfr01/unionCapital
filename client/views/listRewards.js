Template.listRewards.helpers({
  'rewards': function() {
    return Rewards.find();
  },
  'modalContext': function() {
    return Session.get('modalDataContext');
  },
  'editingDoc': function() {
    return Events.findOne(Session.get('modalDataContext')._id);
  },
  'isRewardIndex': function() {
      return Session.get('rewardIndex');
  },
  'rewardView': function() {
      return Session.get('reward');
  },
});

Template.listRewards.events({
  'click .editReward': function(e) {
    Session.set('modalDataContext', this);
  },
  'click .eventView': function(e) {
    Session.set('rewardIndex', false);
    Session.set('reward', this);
  },
  'click .back': function(e) {
    Session.set('rewardIndex', true);
    Session.set('reward', null);
  }
});

Template.listRewards.rendered = function() {
  Session.set('rewardIndex', true);
};
