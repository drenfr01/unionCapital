//Note: partner admin is Laura at KIPP Academy
casper.test.comment("Testing Partner Admin Member Search");

casper.test.begin('All Members', 26, function suite(test) {
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

    test.assertTextExists('test'); //KIPP Academy User
    this.capture('partnerMembers.png');
    test.assertTextExists('kipp'); //KIPP Academy User
    test.assertTextDoesntExist('test2'); //Thrive in Five User

    this.sendKeys('#search-box', 'kipp');
  });

  casper.wait(500, function(){
    test.assertTextExists('kipp');
    test.assertTextDoesntExist('test');
    test.assertTextDoesntExist('test2');
    this.click('.memberRow');
  });

  casper.waitWhileSelector('table', function() {
    test.assertTextExists('kipp');
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
    this.click('#backButton');
  });

  //ensure that points not added to all users
  casper.waitForSelector('#search-box', function(){
    this.sendKeys('#search-box', 'test');
  });

  casper.wait(500, function(){
    test.assertTextDoesntExist('kipp');
    test.assertTextExist('test');
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

