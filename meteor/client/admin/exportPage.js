Template.exportPage.events({
  'click #exportData': function(e) {
    var userId = Meteor.userId();
    Meteor.call('exportData', userId, function(error, response) {
      if(error) {
        console.log(error.reason);
      } else {
        var base64ToBlob, blob;
        base64ToBlob = function(base64String) {
          var blob, byteArray, byteCharacters, byteNumbers, i;
          byteCharacters = atob(base64String);
          byteNumbers = new Array(byteCharacters.length);
          i = 0;
          while (i < byteCharacters.length) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
            i++;
          }
          byteArray = new Uint8Array(byteNumbers);
          return blob = new Blob([byteArray], {
            type: "zip"
          });
        };

        blob = base64ToBlob(response);
        console.log(blob);

        saveAs(blob, 'export.zip');
      }
    });
  }
});
