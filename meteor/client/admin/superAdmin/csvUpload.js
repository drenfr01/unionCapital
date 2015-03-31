CSVUpload = function() {
  //data Array comes in as a 2d array w/ column headers in the first row
  var self = this;
  self.data = [];
  self.events = [];

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
  addData: function(data) {
    this.data = this._clean(data);
  },
  _clean: function(data) {
    if(data.length === 1) {
      addErrorMessage('CSV with no events in it');
    } else {
      return data.slice(1);
    }
  },
})
