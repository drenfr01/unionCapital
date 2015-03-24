casper.test.comment("Testing Super Admin Member Search");

casper.test.begin('All Members', 14, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsSuperAdmin();
  });
  
  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#allMembers');
    this.click('#allMembers');
  });

  casper.waitWhileSelector('#allMembers',function() {
    test.assertExists('#search-box');
    //radio buttons for column sort
    test.assertExists('#ascending');
    test.assertExists('#descending');
    test.assertExists('table');

    test.assertTextExists('test');
    test.assertTextExists('casperjs');

    this.sendKeys('#search-box', 'casperjs');
  });

  casper.wait(500, function(){
    test.assertTextExists('casperjs');
    test.assertTextDoesntExist('test');
    this.click('.memberRow');
  });

  casper.waitWhileSelector('table', function() {
    test.assertTextExists('CasperJS');
    test.assertTextExists('User Profile');
    test.assertExists('#deleteMember');
    test.assertExists('#backButton');
    test.assertExists('#pointsInput');
    test.assertExists('#addPoints');

    test.assertTextExists('No pending transactions!');
    test.assertTextExists('No points accrued yet!');
  });

  //test adding points
  casper.then(function() {
    this.sendKeys('#pointsInput', '100');
    this.click('#addPoints');
  });

  casper.wait(500, function() {
    //this could technically match two instances, Total Points:
    //and the actual row
    test.assertTextExists('100');
    test.assertTextExists('Admin Add Points');
  });

  //TODO: test out deleting user
  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});

