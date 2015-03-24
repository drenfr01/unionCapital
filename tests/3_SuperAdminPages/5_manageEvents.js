casper.test.comment("Testing Super Admin Manage Events");

casper.test.begin('Manage Events', 23, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsSuperAdmin();
  });
  
  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#manageEvents');
    this.click('#manageEvents');
  });

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
    test.assertTextExists('Cambridge Film Festival');
    test.assertTextExists('Cambridge Science Festival');

    this.click('#past');
  });

  //check past events
  casper.wait(500, function() {
    test.assertTextExists('Somerville Cooking Festival');
    test.assertTextExists('Boston Music Festival'); 

    this.clickLabel('Somerville Cooking Festival','a');
  });

  //check editing events
  casper.waitWhileSelector('#addEvent', function() {
    test.assertExists('.back');
    test.assertTextExists('A festival of cooking for the masses');
    test.assertTextExists('50');
    test.assertExists('iframe'); //TODO: this is a bad test for the google map

    this.click('.back');
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
    this.sendKeys('#street2');
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

