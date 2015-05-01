casper.test.comment("Testing Super Admin Partner Admin User Management");

casper.test.begin('Partner Admin User', 23, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsSuperAdmin();
  });
  
  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#partnerOrgs');
    this.click('#partnerOrgs');
  });

  casper.waitWhileSelector('#partnerOrgs',function() {
    this.click('#partnerAdminUsers');
  });

  casper.waitWhileSelector('#partnerAdminUsers', function() {
    test.assertExists('#viewPartnerOrgs');
    test.assertExists('#addPartnerAdminUser');

    test.assertExists('table');

    test.assertTextExists('laura@gmail.com');
    test.assertExists(".editUser");
    test.assertExists('.deleteUser');

    this.click('#addPartnerAdminUser');
  });

  casper.wait(500, function(){
    test.assertExists('#firstName');
    test.assertExists('#lastName');
    test.assertExists('#userEmail');
    test.assertExists('#userPassword');
    test.assertExists('#street1');
    test.assertExists('#street2');
    test.assertExists('#city');
    test.assertExists('#state');
    test.assertExists('#zip');
    test.assertExists('#organizations');

    test.assertExists('#back');
    test.assertExists('#submit');

    this.sendKeys('#firstName', 'Casper');
    this.sendKeys('#lastName', 'Admin');
    this.sendKeys('#userEmail', 'casperAdmin@gmail.com');
    this.sendKeys('#userPassword', 'casperjs');
    this.sendKeys('#street1', '20 Prospect St');
    this.sendKeys('#street2', '#3');
    this.sendKeys('#city', 'Cambridge');
    this.sendKeys('#state', 'MA');
    this.sendKeys('#zip', '02139');
    this.fillSelectors('form#addPartnerAdminUserForm', {
      'select[id="organizations"]': "Thrive in Five"
    }, false);
    this.click('#submit');
  });

  casper.waitForSelector('table', function() {
    test.assertTextExists('Partner Admin Search');
    test.assertTextExists('Casper');
    test.assertTextExists('casperAdmin@gmail.com');
  });

  //TODO: test out edit and delete buttons for partner org
  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});

