casper.test.comment("Testing Partner Admin Delete Events");

casper.test.begin('Manage Events', 9, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsPartnerAdmin();
  });
  
  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#manageEvents');
    this.click('#manageEvents');
  });

  casper.waitWhileSelector('#manageEvents',function() {
    test.assertExists('.deleteEvent');

    //default is current events
    test.assertTextExists('Cambridge Film Festival');
    test.assertTextExists('Cambridge Science Festival');
    test.assertTextExists('Edited Health Clinic');
  });


  //delete event partner admin owns
  casper.waitForSelector('#addEvent', function() {
    this.page.injectJs('../../jquery-1.11.2.min.js');
    this.evaluate(function() {
      $("td:contains('Edited Health Clinic')").parent().find('.deleteEvent').click();
    });
  });

  //try and delete other event (i.e. Thrive in Five)
  casper.wait(500, function() {
    this.page.injectJs('../../jquery-1.11.2.min.js');
    this.evaluate(function() {
      $("td:contains('Cambridge Film Festival')").parent().find('.deleteEvent').click();
    });
  });

  //Check that only one event was deleted
  casper.wait(500, function(){
    test.assertTextExists('Cambridge Film Festival');
    test.assertTextExists('Cambridge Science Festival');
    test.assertTextDoesntExist('Edited Health Clinic');
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});

