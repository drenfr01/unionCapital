CSVUpload = function() {
  //data Array comes in as a 2d array w/ column headers in the first row
  var self = this;
  self.data = [];
  self.events = new ReactiveVar([]);
};

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
    'duration',
    'isPointsPerHour',
    'pointsPerHour',
    'privateEvent',
    'points',
    'adHoc',
    'privateWhitelist',
  ],

  addData: function(incomingData) {
    this.data = this._clean(incomingData);
    this._parseRows(this.data)
  },

  submit: function() {
    _.each(this.events.get(), function(newEvent, num, list) {
      if(newEvent.statusClass === 'bg-success') {
        newEvent.insertEvent();
      }
    }, this);
    Router.go('manageEvents');
  },

  _clean: function(data) {
    if(data.length === 1) {
      sAlert.error('CSV with no events in it');
      return []
    } else if (!_.isEqual(_.map(
      data[0],
      function(elem) {
        return $.trim(elem);
      }), this.columnHeaders)) {
      sAlert.error('Column Header Mismatch')
      return []
    } else {
      return _.map(data.slice(1), function(row) {
        return _.map(row, function(elem) {
          return $.trim(elem);
        });
      });
    }
  },

  _parseRows: function(data) {
    _.each(data, function(rowArr, rowNum, list) {
      eventData = _.object(this.columnHeaders, rowArr);
      thisRowEvent = new NewEvent();
      thisRowEvent.eventData = eventData;
      if(rowArr.length !== this.columnHeaders.length){
        sAlert.error('Event ' + (rowNum + 1) + ' has the wrong columns.')
        thisRowEvent.statusClass = "bg-danger";
        thisRowEvent.statusMsg = "Bad data";
      } else {
        thisRowEvent.statusClass = "bg-success";

        Events.find().forEach(function(event) {
          this.checkEventOverlap(event);
        }, thisRowEvent);

        thisRowEvent.addLocationData();
        thisRowEvent.addSuperCategory(thisRowEvent.category);
      }
      curr = this.events.get();
      curr.push(thisRowEvent)
      this.events.set(curr);
    }, this)//The 'this' pulls the class context into the map function, very necessary...
  }
});

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
    var self = this
    Meteor.call('geocodeAddress', self.eventData.address, function(error, result) {
      if(error) {
        self._addWarning("Bad Location");
        console.log(error.reason)
      } else {
        self.eventData.latitude = result.location.lat;
        self.eventData.longitude = result.location.lng;
        self.locationFound.set(true);
        // good for debugging
        // sAlert.success('lat long success' + result.location.lat + ':' + result.location.lng);
      }
    });
  },

  addSuperCategory: function() {
    this.eventData.superCategoryName = EventCategories.getSuperCategoryForCategory(this.eventData.category);
  },

  insertEvent: function(){
    Events.insert({
      name: this.eventData.name,
      address: this.eventData.address,
      latitude: this.eventData.latitude,
      longitude: this.eventData.longitude,
      url: this.eventData.url,
      description: this.eventData.description,
      active: true,
      eventDate: this.eventData.eventDate,
      institution: this.eventData.institution,
      category: this.eventData.category,
      isPointsPerHour: Boolean(this.eventData.isPointsPerHour),
      points: this.eventData.points,
      pointsPerHour: this.eventData.pointsPerHour,
      duration: this.eventData.duration,
      adHoc: false,
      privateEvent: this.eventData.privateEvent === 'true',
      privateWhitelist: this.eventData.privateWhitelist,
    });
  },

  _addWarning: function(msg){
    this.statusClass = "bg-warning";
    this.statusMsg = msg;
  },
});
