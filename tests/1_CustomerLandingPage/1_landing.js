casper.test.comment("Testing Member Home Page");

casper.test.begin('Landing Page', 7, function suite(test) {
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
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});
