import {Circles} from "/client/lib/circles.js";

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
      console.log(window.Circles);
    }
  });

});

Template.pointsCircle.helpers({
  currentLevel: function() {
    console.log(Circles);
    return Template.instance().currentLevel.get() && 
      Template.instance().currentLevel.get().level;
  },
  pointsToNextLevel: function() {
    return Template.instance().pointsToNextLevel.get();
  }
});
