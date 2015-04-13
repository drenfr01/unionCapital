casper.test.comment("Testing Super Admin Partner Organization Management");

casper.test.begin('Partner Org Management', 21, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsSuperAdmin();
  });

  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#partnerOrgs');
    this.click('#partnerOrgs');
  });

  casper.waitWhileSelector('#partnerOrgs',function() {
    test.assertExists('#search-box');
    test.assertExists('#addPartnerOrg');
    test.assertExists('#partnerAdminUsers');

    test.assertExists('table');

    test.assertTextExists('KIPP Academy');
    test.assertTextExists('Thrive in Five');
    test.assertExists(".editOrg");
    test.assertExists('.deleteOrg');

    this.sendKeys('#search-box', 'Kipp');
  });

  casper.wait(500, function(){
    test.assertTextExists('KIPP Academy');
    test.assertTextDoesntExist('Thrive in Five');

    this.click('#addPartnerOrg');
  });

  casper.waitWhileSelector('table', function() {
    test.assertTextExists('Add Partner Org');

    test.assertExists('#orgName');
    test.assertExists('#orgSector');
    test.assertExists('#membersReported');
    test.assertExists('#submit');
    test.assertExists('#back');

    this.sendKeys('#orgName', 'Casper Testing Hut');
    this.fillSelectors('form#insertPartnerOrgForm', {
      'select[id="orgSector"]': "Other"
    }, false);
    this.sendKeys('#membersReported', '500');

    this.click('#submit');
  });

  casper.wait(500, function() {
    test.assertTextExists('Casper Testing Hut');
    test.assertTextExists('500');
    test.assertTextExists('Children');
    //TODO: test out edit and delete buttons for partner org
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});

