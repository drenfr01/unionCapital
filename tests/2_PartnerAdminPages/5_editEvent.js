casper.test.comment("Testing Partner Admin Edit Event");

//TODO: implement security on edit / delete events

casper.test.begin('Partner Edit Event', 34, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsPartnerAdmin();
  });
  
  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#manageEvents');
    this.click('#manageEvents');
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
