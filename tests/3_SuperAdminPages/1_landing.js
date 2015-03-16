casper.test.comment("Testing Super Admin Home Page");

casper.test.begin('Landing Page', 9, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsSuperAdmin();
  });
  
  //check home page main panel
  casper.waitForSelector("#allMembers", function() {
    test.assertExists("#login-dropdown-list");
    test.assertExists("#allMembers");
    test.assertExists("#partnerOrgs");
    test.assertExists("#approvePoints");
    test.assertExists("#manageEvents");
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

