Addons = new Mongo.Collection('addons');

Addons.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'name of add-on'
  },
  points: {
    type: Number,
    label: 'points per add-on'
  }
}));
