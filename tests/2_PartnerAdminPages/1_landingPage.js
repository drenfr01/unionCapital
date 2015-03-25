casper.test.comment("Testing Partner Admin Home Page");

casper.test.begin('Landing Page', 8, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsPartnerAdmin();
  });
  
  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists("#partnerMembers");
    test.assertExists("#approvePoints");
    test.assertExists("#manageEvents");
    test.assertExists("#exportData");
  });

  //check navbar
  casper.then(function() {
    test.assertExists("#navSAMemberProfiles");
    test.assertExists("#navSAApprovePoints");
    test.assertExists("#navSAManageEvents");
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});

