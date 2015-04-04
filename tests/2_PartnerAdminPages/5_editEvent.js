casper.test.comment("Testing Partner Admin Edit Event");

//TODO: implement security on edit / delete events

casper.test.begin('Partner Edit Event', 15, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsPartnerAdmin();
  });
  
  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#manageEvents');
    this.click('#manageEvents');
  });


  //ensure partner admin cannot edit event that isn't theirs
  casper.waitForSelector('#addEvent', function() {
    this.page.injectJs('../../jquery-1.11.2.min.js');
    this.evaluate(function() {
      $("td:contains('Cambridge Film Festival')").parent().find('.editEvent').click();
    });
    test.assertExists("#addEvent"); //still on same page
  });

  //ensure partner admin can edit their own event
  casper.waitForSelector('#addEvent', function() {
    this.page.injectJs('../../jquery-1.11.2.min.js');
    this.evaluate(function() {
      $("td:contains('Cambridge Science Festival')").parent().find('.editEvent').click();
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

    this.sendKeys('#eventName', 'Cambridge Science Jubilee', {reset: true});
    this.click('#submit');
  });

  //Check that event was updated and only that event was updated
  casper.wait(500, function(){
    test.assertTextExists('Cambridge Science Jubilee');  
    test.assertTextExists('Cambridge Film Festival');

  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});
