//Note: partner admin is Laura at KIPP Academy
casper.test.comment("Testing Partner Admin Member Search");

casper.test.begin('All Members', 24, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsPartnerAdmin();
  });

  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#partnerMembers');
    this.click('#partnerMembers');
  });

  casper.waitWhileSelector('#partnerMembers',function() {
    test.assertExists('#search-box');
    //radio buttons for column sort
    test.assertExists('#ascending');
    test.assertExists('#descending');
    test.assertExists('table');

    test.assertTextExists('Test'); //KIPP Academy User
    test.assertTextExists('kipp'); //KIPP Academy User
    test.assertTextDoesntExist('test2'); //Thrive in Five User

    this.sendKeys('#search-box', 'kipp');
  });

  casper.wait(500, function(){
    test.assertTextExists('kipp');
    test.assertTextDoesntExist('Test2');
    this.click('.memberRow');
  });

  casper.waitWhileSelector('table.table-hover', function() {
    test.assertTextExists('KIPP');
    test.assertExists('#archiveMember');
    test.assertExists('#pointsToAdd');
    test.assertExists('#addPoints');

    test.assertTextExists('Events Waiting for Approval');
    test.assertTextExists('No points accrued yet!');
  });

  //test adding points
  casper.then(function() {
    this.sendKeys('#pointsToAdd', '100');
    this.sendKeys('#pointsDescription', 'Why not?');
    this.click('#addPoints');
  });

  casper.wait(500, function() {
    //this could technically match two instances, Total Points:
    //and the actual row
    test.assertTextExists('100');
    test.assertTextExists('Admin Add Points');
    casper.back()
  });

  //ensure that points not added to all users
  casper.waitForSelector('#search-box', function(){
    this.sendKeys('#search-box', 'test');
  });

  casper.wait(500, function(){
    test.assertTextDoesntExist('kipp');
    test.assertTextExist('Test');
    this.click('.memberRow');
  });

  casper.waitWhileSelector('#search-box', function() {
    test.assertTextExists('No pending transactions!');
    test.assertTextExists('No points accrued yet!');
  });

  //TODO: test out deleting user
  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});

