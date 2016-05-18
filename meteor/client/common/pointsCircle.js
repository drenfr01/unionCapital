Template.pointsCircle.onCreated(function() {
  var self = this;
  self.subscribe('pointlevels');
  self.currentLevel = new ReactiveVar(null)
  self.autorun(function() {
    console.log("running");
    self.currentLevel.set(PointLevels.returnLevel(
      Meteor.user().profile.points));
  });
});

Template.pointsCircle.onRendered(function() {
  $('#pointsCircle').circliful({
    animationStep: 5,
    percent: 75,
    text: "Gold"
  });
});

Template.pointsCircle.helpers({
  currentLevel: function() {
    return Template.instance().currentLevel.get().level;
  },
  pointsToNextLevel: function() {
    return '10000'; 
  }
});
