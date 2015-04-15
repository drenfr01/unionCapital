casper.test.comment("Testing Super Admin Manage Events");

casper.test.begin('Manage Events', 34, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsSuperAdmin();
  });

  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#manageEvents');
    this.click('#manageEvents');
  });

  casper.waitWhileSelector('#manageEvents',function() {
    test.assertExists('#addEvent');
    test.assertExists('#search-box');
    test.assertExists('#institutions');
    test.assertExists('#categories');
    //radio buttons
    test.assertExists('#past');
    test.assertExists('#current');

    test.assertExists('#downloadCSV');
    test.assertExists('table');
    test.assertExists('.editEvent');
    test.assertExists('.deleteEvent');

    //default is current events
    test.assertTextExists('Cambridge Film Festival');
    test.assertTextExists('Cambridge Science Festival');

    this.click('#past');
  });

  //check past events
  casper.wait(500, function() {
    test.assertTextExists('Somerville Cooking Festival');
    test.assertTextExists('Boston Music Festival');

    this.clickLabel('Somerville Cooking Festival','a');
  });

  //check click on single event
  casper.waitWhileSelector('#addEvent', function() {
    test.assertExists('.back');
    test.assertTextExists('A festival of cooking for the masses');
    test.assertTextExists('50');
    test.assertExists('iframe'); //TODO: this is a bad test for the google map

    this.click('.back');
  });

  //goto to Edit Event Page
  casper.waitForSelector('#addEvent', function() {
    this.evaluate(function() {
      $("td:contains('Somerville Cooking Festival')").parent().find('.editEvent').click();
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

    this.sendKeys('#eventName', 'Somerville Cooking Jubilee', {reset: true});
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

