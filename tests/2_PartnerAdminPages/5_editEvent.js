casper.test.comment("Testing Partner Admin Edit Event");

/*
 * View All Events: can view RSVP list of own event, can't see it on another
 * Somerville Cooking Jubilee Edit event: can edit one event, can't edit another
 * Delete event: can delete own event, can't delete another
 */

casper.test.begin('Partner Edit Event', 34, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsPartnerAdmin();
  });
  
  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#manageEvents');
    this.click('#manageEvents');
  });

  casper.waitWhileSelector('#manageEvents',function() {
  });
  
  //check past events
  casper.wait(500, function() {
    test.assertTextExists('Boston Music Festival'); //KIPP
    test.assertTextExists('Cambridge Film Festival'); //Thrive in Five
    test.assertTextExists('Admin Add Points'); //Other

    this.clickLabel('Cambridge Film Festival','a');
  });

  //check click on single event
  casper.waitWhileSelector('#addEvent', function() {
    test.assertExists('.back');
    test.assertTextExists('A festival of cooking for the masses');
    test.assertTextExists('Thrive in Five');
    test.assertExists('iframe'); //TODO: this is a bad test for the google map

    this.click('.back');
  });

  //got to Edit Event Page
  casper.waitForSelector('#addEvent', function() {
    this.page.injectJs('../../jquery-1.11.2.min.js');
    this.evaluate(function() {
      $("td:contains('Cambridge Film Festival')").parent().find('.editEvent').click();
    });
  });
  
  //Check Page then edit event
  casper.waitWhileSelector('#addEvent', function() {
    test.assertExists('#eventName');
    test.assertExists('#eventAddress');
    test.assertExists('#eventUrl');
    test.assertExists('#eventDesc');
    test.assertExists('#eventOrg');
    test.assertExists('#eventCategory');
    test.assertExists('#eventDate');
    test.assertExists("#eventPoints");
    test.assertExists("#back");
    test.assertExists('#submit');

    this.sendKeys('#eventName', 'Cambridge Film Jubilee', {reset: true});
    this.click('#submit');
  });

  //Check event edited, then delete it
  casper.wait(500, function(){
    this.click('#past');
    test.assertTextExists('Somerville Cooking Jubilee');  
    test.assertTextExists('Boston Music Festival');

    this.evaluate(function() {
      $("td:contains('Somerville Cooking Jubilee')").parent().find('.deleteEvent').click();
    });

  });

  casper.wait(500, function() {
    test.assertTextDoesntExist('Somerville Cooking Jubilee');
    test.assertTextExists('Boston Music Festival');
    
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});
