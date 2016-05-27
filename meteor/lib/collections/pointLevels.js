PointLevels = new Mongo.Collection('pointlevels');

PointLevels.attachSchema(new SimpleSchema({
  level: {
    type: String,
    label: 'Name of level',
  },
  start: {
    type: Number,
    label: 'Low end of point range'
  },
  end: {
    type: Number,
    label: 'High end of point range'
  },
  color: {
    type: String,
    label: 'color of point level'
  }
}));

PointLevels.returnLevel = function(userPoints) {
  //start with lowest level
  const currentLevel = PointLevels.findOne({start: 0});
  //note: this relies on a sorted index on points
  const pointLevels = PointLevels.find().fetch();
  return R.head(R.filter(x => userPoints <= x.end, pointLevels));
}

PointLevels.nextLevel = function(userPoints) {
  const currentLevel = PointLevels.returnLevel(userPoints);
  
  //note: this relies on a sorted index on points
  const pointLevels = PointLevels.find().fetch();
  return R.head(R.filter(x => x.end > currentLevel.end, pointLevels));
}

PointLevels.pointsToNextLevel = function(userPoints) {
  var nextLevel = PointLevels.nextLevel(userPoints);
  console.log(PointLevels.nextLevel(userPoints));
  return 0;
  //return nextLevel.start - userPoints;
}
