Template.uploadEvents.created = function () {
  //This is the template instance here
  this.fileNotUploaded = new ReactiveVar(true);
  this.csvUpload = new CSVUpload()
}

Template.uploadEvents.helpers({
  buttonDisabled: function() {
    return Template.instance().fileNotUploaded.get();
  },
  columnHeaders: function() {
    cols = Template.instance().csvUpload.columnHeaders;
    return cols.join(', ')
  },
  eventsToBeCreated: function() {
    return Template.instance().csvUpload.events.get();
  }
})

Template.uploadEvents.events({
  'change #uploadEvents': function(e, template) {
    // This defaults the submit button to disabled until a file is uploaded
    template.fileNotUploaded.set(false);
    $('#uploadEvents').parse({
      config: {
        // This is semi confusing, the complete function in the config of
        // the parse method is called on the data results, the complete callback
        // is called with no results passed to it.
        complete: function(results) {
          template.csvUpload.addData(results.data)
        }
      },
      error: function(err, file, inputElem, reason) {
        addErrorMessage(err);
        console.log(err, file, inputElem, reason);
      },
      complete: function() {
        console.log('parsing complete')
      }
    })
  },
})

Template.newEvent.helpers({
  locationFound: function() {
    console.log(Template.instance())
    console.log(Template.instance().data.eventData)

    return Template.instance().data.locationFound.get();
  }

})
