# Union Capital
## Overview
This application is a prototype for the union capital application which will enable community members to check in at their volunteer events, track their points
etc.  

## Installation

Install Node, and NPM with it:
`curl -L https://npmjs.org/install.sh | sh`

Install Meteorite
`npm install -g meteorite`

Install Meteor
`curl https://install.meteor.com/ | sh`

Run meteorite from the base level of this repo.
`mrt` Depending on your permissions, you may need to run `sudo mrt`


Design Notes (6/21/2014):

- filter events to only Admin creates ones (bug)
- messages are too big and dont fade away (5 seconds)
- filter info messages based on what user cares about
- indicate that you can click on future elements (underline event names)
- change URL to Event Website (on Current / Upcoming Events)
- clean up routes (match template names to functionality)
- icon in navbar and home should go to member or admin home page
- scrap QR code completely, replace with geo location check in
- Categories for members dont make sense
- consider Facebook integration -> review photos
- odd behavior when clicking on Change Password (also have to hard reload things)
- need account management page 
- define page with boundaries with borders
- switch navigation menu based on user type
- remove Actions button on Admin Member Profiles
- takes 2 clicks to access buttons
- input validation
- make event active a checkbox
- event tagging 
- search events based on tags / locations
- make zoom level one greater, change family independence center
- abilily to edit member profiles (expand members)
- have event history, point total, 
- make all headers <small>
- why is Somerville cooking class not present on edit events (admin?) -> need to show past events
- add submit request for event to Member 
- have users register for events (are you going), then show totals on Admin page
