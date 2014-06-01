Template.showMemberRewards.helpers({
  'rewards': function(){
    return Rewards.find().fetch();
  }
})
