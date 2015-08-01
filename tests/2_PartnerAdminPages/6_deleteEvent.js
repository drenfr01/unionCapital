casper.test.comment("Testing Partner Admin Delete Events");

casper.test.begin('Manage Events', 7, function suite(test) {
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
    test.assertTextExists('Cambridge Science Festival');
    test.assertTextExists('Health Clinic Edited');
  });


  //delete event partner admin owns
  casper.waitForSelector('#addEvent', function() {
    this.page.injectJs('../../jquery-1.11.2.min.js');
    this.evaluate(function() {
      $("td:contains('Health Clinic Edited')").parent().find('.deleteEvent').click();
    });
  });

  // once again, removed because they will not be able to see other events
  //try and delete other event (i.e. Thrive in Five)
  // casper.wait(500, function() {
  //   this.page.injectJs('../../jquery-1.11.2.min.js');
  //   this.evaluate(function() {
  //     $("td:contains('Cambridge Science Festival')").parent().find('.deleteEvent').click();
  //   });
  // });

  //Check that only one event was deleted
  casper.wait(500, function(){
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

