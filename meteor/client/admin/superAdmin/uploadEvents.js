Template.uploadEvents.created = function () {
  this.fileNotUploaded = new ReactiveVar(true);
}

Template.uploadEvents.helpers({
  buttonDisabled: function() {
    return Template.instance().fileNotUploaded.get()
  }
})

Template.uploadEvents.events({
  'change #uploadEvents': function(e, template) {
    // This defaults the submit button to disabled until a file is uploaded
    template.fileNotUploaded.set(false);
  },
  'click #submitEvents': function(e) {
    e.preventDefault();
    console.log('submitting events')
    eventsFile = $('#uploadEvents')

    console.log(eventsFile.val())
  }
})
