casper.test.comment("Testing Super Admin Home Page");

casper.test.begin('Landing Page', 10, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsSuperAdmin();
  });
  
  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists("#allMembers");
    test.assertExists("#partnerOrgs");
    test.assertExists("#approvePoints");
    test.assertExists("#manageEvents");
    test.assertExists("#exportData");
  });

  //check navbar
  casper.then(function() {
    test.assertExists("#navSAMemberProfiles");
    test.assertExists("#navSAPartnerOrgs");
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

