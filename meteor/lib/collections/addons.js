Addons = new Mongo.Collection('addons');

Addons.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'name of add-on'
  },
  points: {
    type: Number,
    label: 'points per add-on'
  },
  display: {
    type: Boolean,
    label: 'Should I display?'
  },
  //note: if the addon applies to all selfies it's listed as 
  //AppConfig.selfieEvent
  //if it applies to all prelistedEvents it is AppConfig.preListedEvent
  categoryWhitelist: {
    type: [String],
    label: "Whitelist of category",
    optional: true
  }
}));
