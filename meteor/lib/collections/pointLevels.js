/* global R */
/* global PointLevels:true */
/* global SimpleSchema */

PointLevels = new Mongo.Collection('pointlevels');

PointLevels.attachSchema(new SimpleSchema({
  level: {
    type: String,
    label: 'Name of level',
  },
  start: {
    type: Number,
    label: 'Low end of point range',
  },
  end: {
    type: Number,
    label: 'High end of point range',
  },
  color: {
    type: String,
    label: 'color of point level',
  },
}));

PointLevels.returnLevel = function(userPoints) {
  const pointLevels = PointLevels.find({}, {sort: {end: 1}}).fetch();
  return R.head(R.filter(x => userPoints <= x.end, pointLevels));
};

PointLevels.nextLevel = function(userPoints) {
  const currentLevel = PointLevels.returnLevel(userPoints);
  
  if(currentLevel) { 
    const pointLevels = PointLevels.find({}, {sort: {end: 1}}).fetch();
    return R.head(R.filter(x => x.end > currentLevel.end, pointLevels));
  }
};

PointLevels.pointsToNextLevel = function(userPoints) {
  const nextLevel = PointLevels.nextLevel(userPoints);
  const currentLevel = PointLevels.returnLevel(userPoints) || {end: 0};
  return nextLevel ? nextLevel.start - userPoints : currentLevel.end - userPoints;
};
