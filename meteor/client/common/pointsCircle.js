/* global PointLevels */

Template.pointsCircle.onCreated(function() {
  var self = this;

  self.subscribe('pointlevels');
  self.currentLevel = new ReactiveVar(null)
  self.nextLevel = new ReactiveVar(null);
  self.pointsToNextLevel = new ReactiveVar(null);
  self.autorun(function() {
    const points = Meteor.user().profile.points;
    self.currentLevel.set(PointLevels.returnLevel(points));
    self.nextLevel.set(PointLevels.nextLevel(points));
    self.pointsToNextLevel.set(PointLevels.pointsToNextLevel(points));
  });
});

Template.pointsCircle.onRendered(function() {
  var self = this;

  console.warn('make this percent real...');
  self.autorun(function() {
    var nextLevel = self.nextLevel.get();
    if(nextLevel) {
      $('.pointsCircle').empty();
      $('.pointsCircle').circliful({
        animationStep: 20,
        percent: 75,
        percentageTextSize: 16,
        text: 'to ' + nextLevel.level,
        textColor: nextLevel.color,
        textStyle: 'font-size: 12px',
      });
    }
  });
});

Template.pointsCircle.helpers({
  currentLevel: function() {
    console.log(Circles);
    return Template.instance().currentLevel.get() && 
      Template.instance().currentLevel.get().level;
  },

  currentLevelColor: function() {
    return Template.instance().currentLevel.get() && 
      Template.instance().currentLevel.get().color;
  },

  pointsToNextLevel: function() {
    return Template.instance().pointsToNextLevel.get();
  },

  totalPoints: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.points || 0;
    }
    return 'Loading...';
  },
});
