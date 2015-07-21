casper.test.comment("Testing Super Admin Member Search");

casper.test.begin('All Members', 19, function suite(test) {
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

    test.assertTextExists('Test');
    test.assertTextExists('CasperJS');

    this.sendKeys('#search-box', 'casperjs');
  });

  casper.wait(500, function(){
    test.assertTextExists('CasperJS');
    test.assertTextDoesntExist('Test');
    this.click('.memberRow');
  });

  casper.waitForSelector('#archiveMember', function() {
    test.assertTextExists('CasperJS');
    test.assertExists('#archiveMember');
    test.assertExists('#pointsToAdd');
    test.assertExists('#pointsDescription');
    test.assertExists('#addPoints');

    test.assertTextExists('Boston Music');
  });

  casper.then(function () {
    this.click('#archiveMember')
    casper.wait(500, function(){
      test.assertTextExists('Archived')
      this.click('#unarchiveMember')
    })
  })

  //test adding points
  casper.then(function() {
    this.sendKeys('#pointsToAdd', '100');
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

