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
      eventData = _.object(this.columnHeaders, rowArr)
      thisRowEvent = new newEvent(eventData)
      if(rowArr.length !== this.columnHeaders.length){
        addErrorMessage('Event "' + rowArr[0] + '" has the wrong columns.')
        thisRowEvent.statusClass = "bg-danger"
      } else {
        thisRowEvent.statusClass = "bg-success"
      }
      curr = this.events.get();
      curr.push(thisRowEvent)
      console.log(curr)
      this.events.set(curr);
    }, this)//The 'this' pulls the context into the map function, very necessary...
  }
})

newEvent = function(eventData) {
  var self = this;
  self.eventData = {};
  self.statusClass = ''
}
