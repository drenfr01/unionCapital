casper.test.comment("Testing Member Home Page");

casper.test.begin('Landing Page', 8, function suite(test) {
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
    test.assertExists("#navMemberShare");
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});
