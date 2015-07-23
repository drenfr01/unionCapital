# Union Capital Boston
## Overview

This application is designed to allow members of a community to log their participation in communal events through mobile or desktop devices. Once registered, members can "check into" pre-existing events or document their own events through text input, geolocation, and photographs. These submissions will either be auto-approved (if sufficient data like geolocation exists) or sent to partner administrators or super admins for approval. 

Members are assigned either directly to the overarching organization, Union Capital Boston, or to a partner organization. If members are assigned to a partner organization then that organization is responsible for approving most of their points, etc. Likewise the partner org can view their members event history, total points, basic contact info, etc. Partner Orgs also create their own events, and approve points from anyone who attends those events. 

The super administrator, as the name implies, has full control over the application. Their primary role is approving "edge case" member event submissions (e.g. a member creating their own event and submitting only a photo for evidence), managing partner organizations, and creating events that have broad appeal (e.g. Boston wide events). 


## Roles

Member - can check into events (either with geolocation or a photo), view past and future events, contact super admins, and view their points through mobile friendly pages.

Partner Administrator - can view assigned members data, create events, approve points for their members, etc.

Super Administrator - can view all data, create partner administrators, create members, approve points for members, etc.

## Installation

1) Install Meteor (https://www.meteor.com/install). Note Node JS is a pre-requisite and may require a separate install  
2) Clone this repo  
3) Navigate to the /meteor folder in this repo    
4) Run 'meteor --settings <your_settings_file.js>'. Settings files contain Facebook keys, the type of environment, etc.    
5) Navigate in a browser to localhost:3000 to access app   

## License

Copyright (c) 2015 Union Capital Boston

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
