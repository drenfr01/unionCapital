casper.test.comment("Testing Partner Admin View Events");

casper.test.begin('Manage Partner Events', 34, function suite(test) {
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

    test.assertExists('#downloadCSV');
    test.assertExists('table');
    test.assertExists('.editEvent');
    test.assertExists('.deleteEvent');

    //default is current events
    test.assertTextExists('Cambridge Science Festival'); //KIPP
    test.assertTextExists('Cambridge Film Festival'); //Thrive in Five

    this.click('#past');
  });

  //ensure past events exist
  casper.wait(500, function() {
    test.assertTextExists('Boston Music Festival'); //KIPP
    test.assertTextExists('Somerville Cooking Festival'); //Thrive in Five
    test.assertTextExists('Admin Add Points'); //Other

    this.click('current');
  });

  //ensure present events exists
  casper.wait(500, function() {
    test.assertTextExists('Cambridge Science Festival'); //KIPP
    test.assertTextExists('Cambridge Film Festival'); //Thrive in Five

    this.clickLabel('Cambridge Film Festival', 'a');
  });

  //ensure list of attendees only displayed for events the
  //partner admin controls
  casper.waitWhileSelector('#addEvent', function() {
    test.assertExists('.back');
    test.assertTextExists('Watch as many films as you can in just 3 days of mandness!');
    test.assertTextExists('Thrive in Five');
    test.assertExists('iframe'); //TODO: this is a bad test for the google map

    //TODO: put in number of reservations and name of person
    test.assertTextExists('Data Restricted');

    this.click('.back');
  });

  casper.waitForSelector('#addEvent', function() {
    this.clickLabel('Cambridge Science Festival', 'a');
  });

  casper.waitWhileSelector('#addEvent', function() {
    test.assertTextExists('A festival of science for everybody');
    test.assertTextExists('KIPP Academy');
    test.assertTextExists('Data Restricted');

    //TODO: put in number of reservations and name of person
    test.assertExists('tr'); //ensure table row exists
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});

