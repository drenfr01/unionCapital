CSVUpload = function() {
  //data Array comes in as a 2d array w/ column headers in the first row
  var self = this;
  self.data = [];
  self.events = new ReactiveVar([]);

}

_.extend(CSVUpload.prototype, {
  // TODO: Ideally this would pull from the schema for events
  // But for now we can edit this
  columnHeaders: [
    'name',
    'address',
    'url',
    'description',
    'institution',
    'category',
    'eventDate',
    'isPointsPerHour',
    'pointsPerHour',
    'points',
  ],
  addData: function(incomingData) {
    this.data = this._clean(incomingData);
    this._parseRows(this.data)
  },
  _clean: function(data) {
    if(data.length === 1) {
      addErrorMessage('CSV with no events in it');
      return []
    } else if (!_.isEqual(data[0], this.columnHeaders)) {
      addErrorMessage('Column Header Mismatch')
      return []
    } else {
      return data.slice(1);
    }
  },
  _parseRows: function(data) {
    _.each(data, function(rowArr, rowNum, list) {
      eventData = _.object(this.columnHeaders, rowArr);
      thisRowEvent = new NewEvent();
      thisRowEvent.eventData = eventData;
      if(rowArr.length !== this.columnHeaders.length){
        addErrorMessage('Event ' + (rowNum + 1) + ' has the wrong columns.')
        thisRowEvent.statusClass = "bg-danger";
        thisRowEvent.statusMsg = "Bad data";
      } else {
        thisRowEvent.statusClass = "bg-success";

        Events.find().forEach(function(event) {
          this.checkEventOverlap(event);
        }, thisRowEvent);

        thisRowEvent.addLocationData();
      }
      curr = this.events.get();
      curr.push(thisRowEvent)
      this.events.set(curr);
    }, this)//The 'this' pulls the class context into the map function, very necessary...
  }
})

NewEvent = function() {
  var self = this;
  self.eventData = {};
  self.statusClass = ''
  self.statusMsg = ''
  self.locationFound = new ReactiveVar(false);
}

_.extend(NewEvent.prototype, {
  checkEventOverlap: function(otherEvent){
    if(
      this.eventData.name === otherEvent.name &&
      this.eventData.institution === otherEvent.institution
      // Need a date check here
    ) {
      this._addWarning("Duplicate");
    }
  },
  addLocationData: function(){
    Meteor.call('geocodeAddress', this.eventData.address,
                function(error, result) {
                  if(error) {
                    this._addWarning("Bad Location");
                    console.log(error.reason)
                  } else {
                    this.eventData.latitude = result.location.lat;
                    this.eventData.longitude = result.location.lng;
                    this.locationFound.set(true);
                    addSuccessMessage('lat long success' + result.location.lat + ':' + result.location.lng);
                  }
                })
  },
  sendToServer: function(){
    console.log(this.eventData.latitude)
  },
  _addWarning: function(msg){
    this.statusClass = "bg-warning";
    this.statusMsg = msg;
  }
})
