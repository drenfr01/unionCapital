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
  var currentLevel = PointLevels.findOne({start: 0});
  PointLevels.find().forEach(function(level) {
    if(userPoints > level.end) {
      currentLevel = level; 
    }
  });

  return currentLevel;
}
