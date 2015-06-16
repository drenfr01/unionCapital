AppConfig = {

  // Admin email to send admin request to
  adminEmail: "eric.leslie@unioncapitalboston.com",

  // Check in process
  checkIn: {

    // When today is selected, how many hours ahead to look for events
    today: {

      // The number of hours to look ahead from the current time
      hoursAhead: 12,

      // The number of hours to look behind from the current time
      hoursBehind: -12
    },

    // Past events
    past: {

      // Hours ahead of current time - this should line up with today.hoursBehind
      hoursAhead: -12,

      // How many hours in the past to look (7*24)
      hoursBehind: -168
    }
  },

  // Event calendar
  eventCalendar: {

    future: {

      // how many days to look into the future
      hoursAhead: 6*7*24,

      // how many days to look into the future
      hoursBehind: 0
    },

    past: {

      // how many days to look into the future
      hoursAhead: 0,

      // how many days to look into the future
      hoursBehind: -7*24
    }
  }
}