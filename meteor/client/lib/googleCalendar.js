GoogleCalendar = (function () {

  var CLIENT_ID = "159579538454-5c0m83pb6joi2kp26pfef9vufr7jvk9u.apps.googleusercontent.com";
  var SCOPES = ["https://www.googleapis.com/auth/calendar"];

  var calendarEvent;

  function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
      authorizeDiv.style.display = 'none';
      loadCalendarApi();
    } else {
      authorizeDiv.style.display = 'inline';
    }
  }


  function loadCalendarApi() {
    //note: can include an optional callback here
    gapi.client.load('calendar', 'v3', function(err, result) {
      var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': calendarEvent
      });

      request.execute(function(event) {
        console.log(event);
        addSuccessMessage(event.htmlLink);
      });
    });
  }


  return {
    setEvent: function(event) {
      calendarEvent = event;
    },
    checkAuth: function() {
      gapi.auth.authorize( {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, handleAuthResult);
    },
    appendPre: function(message) {
      var pre = document.getElementById('output');
      var textContent = document.createTextNode(message + '\n');
      pre.appendChild(textContent);
    },
    handleAuthClick: function(event) {
      gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult
      );
      return false;
    }
  };
})();
