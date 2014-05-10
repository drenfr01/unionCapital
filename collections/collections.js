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
            lat: {
                   type: Number,
                   label: 'Latitude of Marker'
                 },
            lng: {
                   type: Number,
                   label: 'Longitude of Marker'
                 }
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
