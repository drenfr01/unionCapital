Markers = new Meteor.Collection('markers', {
  schema: {
            Name: {
                     type: String,
                     label: 'Name of Event'
                  },
            address: {
                       type: String,
                       label: 'Address of Event'
                     },
            description: {
                           type: String,
                           label: 'Description of Event'
                         },
            active: {
                      type: Number,
                      label: 'Is event active?',
                      allowedValues: [0,1],
                      defaultValue: 1
                    },
            startDate: {
                         type: Date,
                         label: 'Beginning of Event'
                       },
            
            endDate: {
                       type: Date,
                       label: 'End of Event'
                     },
          }
});

Markers.allow({
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
Images = new FS.Collection("images", {
    stores: [new FS.Store.GridFS("images", {path: '/Users/duncanrenfrow-symon/Documents/Meteor_App/apparel/uploads', maxTries:10})]
});
FS.debug = true;

//TODO: obviously change trivially true return when we implement user login
Images.allow({
  insert: function(userId, doc) {
    return true;
  },
    update: function(userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  },
  download: function(userId, doc) {
    return true;
  }
});
