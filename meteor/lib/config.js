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
    },
    // Max distance for ad hoc event in km
    maxAdHocDistance: 0.2,
    // Max distance for recognized event in km
    maxEventDistance: 0.2,
    // photos
    maxPhotoDimensions: {
      height: 960,
      width: 960
    }
  },
  // Event calendar
  eventCalendar: {
    future: {
      // how many days to look into the future
      hoursAhead: 6*7*24,
      // how many days to look into the future
      hoursBehind: -24
    },
    past: {
      // how many days to look into the future
      hoursAhead: 0,
      // how many days to look into the future
      hoursBehind: -7*24
    }
  },
  ucbButtonEvent: 'UCB Button',
  "public": {
    "recordsPerPage": 50
  },
  eventRange: {
    current: "current",
    past: "past"
  },
  feedbackType: {
    rating: "rating",
    comment: "comment"
  },
  selfieEvent: "Selfie",
  prelistedEvent: "Prelisted",
  //this below is a complete hack, but re-writing how we 
  //handle fixed point events that are selfie submissions
  //is a huge undertaking
  event100Points: "Event 100 points"
};
