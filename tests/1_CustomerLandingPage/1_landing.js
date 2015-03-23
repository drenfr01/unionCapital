casper.test.comment("Testing Member Home Page");

casper.test.begin('Landing Page', 8, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsUser();
  });
  
  //check home page main panel
  casper.waitForSelector("#lnkCheckIn", function() {
    test.assertExists('#lnkTotalPoints');
    test.assertExists("#login-dropdown-list");
    test.assertExists("#lnkEvents");
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
