Template.pointsCircle.onCreated(function() {
  var self = this;
  self.subscribe('pointlevels');
  self.currentLevel = new ReactiveVar(null)
  self.nextLevel = new ReactiveVar(null);
  self.autorun(function() {

    self.currentLevel.set(PointLevels.returnLevel(
      Meteor.user().profile.points));

    self.nextLevel.set(PointLevels.nextLevel(
      Meteor.user().profile.points));
    console.log(self.nextLevel.get());
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
    return '10000'; 
  }
});
