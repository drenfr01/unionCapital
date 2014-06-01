Rewards = new Meteor.Collection('rewards', {
  schema: {
            name: {
                     type: String,
                     label: 'Name of Reward'
                  },
            description: {
                           type: String,
                           label: 'Description of Reward'
                         },
            price: {
                       type: Number,
                       label: 'Amount of Points this Reward Costs'
                     },
            image: {
                      type: Number,
                      label: 'ID of image for reward',
                      optional: true
                    }
          }
});

Rewards.allow({
  insert: function() {
            return true;
          },
  update: function() {
            return true;
          },
  remove: function() {
            return true;
          },
});
