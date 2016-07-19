/* global PointLevels */

Template.pointsCircle.onCreated(function() {
  var self = this;

  self.subscribe('pointlevels');
  self.currentLevel = new ReactiveVar(null)
  self.nextLevel = new ReactiveVar(null);
  self.pointsToNextLevel = new ReactiveVar(null);
  self.autorun(function() {
    const user = Meteor.user();
    if (user) {
      const points = user.profile.points;
      self.currentLevel.set(PointLevels.returnLevel(points));
      self.nextLevel.set(PointLevels.nextLevel(points));
      self.pointsToNextLevel.set(PointLevels.pointsToNextLevel(points));
    }
  });
});

Template.pointsCircle.onRendered(function() {
  var self = this;

  self.autorun(function() {
    var nextLevel = self.nextLevel.get();
    var currentLevel = self.currentLevel.get();
    if(nextLevel) {
      var totalPoints = Meteor.user() ? Meteor.user().profile.points || 0 : 0;
      var percentage = (totalPoints / nextLevel.start) * 100;
      $('.pointsCircle').empty();
      $('.pointsCircle').circliful({
        animationStep: 20,
        percent: percentage,
        percentageTextSize: 16,
        text: 'to ' + nextLevel.level,
        textColor: nextLevel.color,
        textStyle: 'font-size: 12px',
        foregroundColor: nextLevel.color,
        backgroundColor: currentLevel.color
      });
    } else if(currentLevel) {

      var totalPoints = Meteor.user() ? Meteor.user().profile.points || 0 : 0;
      var percentage = (totalPoints / currentLevel.end) * 100;
      $('.pointsCircle').empty();
      $('.pointsCircle').circliful({
        animationStep: 20,
        percent: percentage,
        percentageTextSize: 16,
        text: 'to max points!',
        textColor: currentLevel.color,
        textStyle: 'font-size: 12px',
        foregroundColor: currentLevel.color,
        backgroundColor: '#000000' //black
      });
    } else {
      //loading 
    }
  });
});

Template.pointsCircle.helpers({
  currentLevel: function() {
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
