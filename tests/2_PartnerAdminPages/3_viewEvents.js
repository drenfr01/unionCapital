casper.test.comment("Testing Partner Admin View Events");

casper.test.begin('Manage Partner Events', 23, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsPartnerAdmin();
  });

  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#manageEvents');
    this.click('#manageEvents');
  });

  //ensure present events exist along with all buttons
  casper.waitWhileSelector('#manageEvents',function() {
    test.assertExists('#addEvent');
    test.assertExists('#search-box');
    test.assertExists('#institutions');
    test.assertExists('#categories');
    //radio buttons
    test.assertExists('#past');
    test.assertExists('#current');

    test.assertExists('table');
    test.assertExists('.editEvent');
    test.assertExists('.deleteEvent');

    //default is current events
    test.assertTextExists('Cambridge Science Festival'); //KIPP
    test.assertTextExists('Boston Music Festival'); //KIPP
    // test.assertTextExists('Cambridge Film Festival'); //Thrive in Five

    this.click('#past');
  });

  //ensure past events exist
  casper.wait(500, function() {
    // test.assertTextExists('Somerville Cooking Festival'); //Thrive in Five
    test.assertTextExists('Boston Music Festival'); //KIPP

    this.click('#current');
  });

  //ensure present events exists
  // Should only see partner org events
  casper.wait(500, function() {
    test.assertTextExists('Cambridge Science Festival'); //KIPP
    test.assertTextExists('Boston Music Festival');

    this.clickLabel('Boston Music Festival', 'a');
  });

  //Thrive in Five Event
  // REMOVING... this shouldn't be in here...
  casper.waitWhileSelector('#addEvent', function() {
    // test.assertExists('.back');
    // test.assertTextExists('Watch as many films as you can in just 3 days of mandness!');
    // test.assertTextExists('Thrive in Five');
    // test.assertExists('iframe'); //TODO: this is a bad test for the google map

    // test.assertTextExists('4'); //Total RSVPS
    // //KIPP Member
    // test.assertTextExists('CasperJS');
    // test.assertTextExists('2');
    // //Thrive in Five Member
    // test.assertTextDoesntExist('Test2');

    this.click('.back');
  });

  casper.waitForSelector('#addEvent', function() {
    this.clickLabel('Cambridge Science Festival', 'a');
  });

  //KIPP Event
  casper.waitWhileSelector('#addEvent', function() {
    test.assertTextExists('A festival of science for everybody');
    test.assertTextExists('KIPP Academy Boston');

    test.assertTextExists('8'); //Total RSVPS
    //KIPP Member
    test.assertTextExists('CasperJS');
    test.assertTextExists('3');
    //Thrive in Five Member
    test.assertTextExists('Test2');
    test.assertTextExists('5');
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});

