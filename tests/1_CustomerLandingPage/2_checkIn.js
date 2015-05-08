casper.test.comment("Testing Member Check-In");

casper.test.begin('Check-In', 16, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsUser();
  });

  //check home page main panel
  casper.waitForSelector("#totalPointsDiv", function() {
    test.assertExists('#checkInDiv');
    test.assertExists("#login-dropdown-list");
    test.assertExists("#eventsCalendarDiv");
  });

  //check navbar
  casper.then(function() {
    test.assertExists("#navMemberEvents");
    test.assertExists("#navMemberPoints");
    test.assertExists("#navMemberContact");

    this.click('#checkInDiv a');
  });

  // Check that events are present
  casper.waitForSelector('#eventSearchBox', function() {
    test.assertExists('#map-canvas');
    test.assertExists('#accordion');
    test.assertExists('.accordion-button');
    test.assertTextExists('Use this option');

    this.click('.panel-heading a');
  });

  casper.wait(1000, function() {
    this.click('.accordion-button');
  });

  casper.waitForSelector('.check-in-button', function() {
    test.assertExists('.btn-default');
    this.click('.check-in-button');
  });

  casper.waitForSelector('#addPhoto', function() {
    test.assertExists('#durationSlider');
    test.assertExists('.no-photo-checkin');
    test.assertExists('#back');
    this.click('.check-in');
  });

  casper.wait(2000, function() {
    test.assertExists("#checkInDiv");
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});
