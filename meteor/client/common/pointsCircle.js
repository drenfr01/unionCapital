Template.pointsCircle.onCreated(function() {
  var self = this;
  self.subscribe('pointlevels');
  self.currentLevel = new ReactiveVar(null)
  self.nextLevel = new ReactiveVar(null);
  self.pointsToNextLevel = new ReactiveVar(null);
  self.autorun(function() {

    self.currentLevel.set(PointLevels.returnLevel(
      Meteor.user().profile.points));

    self.nextLevel.set(PointLevels.nextLevel(
      Meteor.user().profile.points));

    self.pointsToNextLevel.set(PointLevels.pointsToNextLevel(
      Meteor.user().profile.points));

  });
});

Template.pointsCircle.onRendered(function() {
  var self = this;

  self.autorun(function() {
    var pointLevel = self.currentLevel.get();
    var nextLevel = self.nextLevel.get();
    if(nextLevel) {
      $('#pointsCircle').circliful({
        animationStep: 10,
        percent: 75,
        percentageTextSize: 16,
        text: "to " + nextLevel.level,
        textColor: nextLevel.color,
        textStyle: "font-size: 12px" 
      });
    }
  });

});

Template.pointsCircle.helpers({
  currentLevel: function() {
    return Template.instance().currentLevel.get() && 
      Template.instance().currentLevel.get().level;
  },
  pointsToNextLevel: function() {
    return Template.instance().pointsToNextLevel.get();
  }
});
