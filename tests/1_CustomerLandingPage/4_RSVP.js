casper.test.comment("Testing Member Reservations");

casper.test.begin('Reservations Page', 4, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsUser();
  });

  //check home page main panel
  casper.waitForSelector("#login-dropdown-list", function() {
    this.clickLabel('Today in Boston', 'a');
  });

  casper.waitForSelector('#search-box', function() {
    this.sendKeys('#search-box', 'Cambridge Film Festival');
  });

  //Ensure user can RSVP for events of both their partnerOrg and others
  //Other Partner Org
  casper.wait(250, function() {

    this.fillSelectors('form#reservationForm', {
      'select': "2"
    }, false);
    this.click('.insertReservation');
  });

  //Ensure user can remove reservation
  casper.wait(250, function() {
    test.assertExists('.removeReservation');

    this.click('.removeReservation');
  });

  casper.wait(250, function() {
    test.assertExists('.insertReservation');
    //put back in reservation to test with partner admin
    this.fillSelectors('form#reservationForm', {
      'select': "2"
    }, false);
    this.click('.insertReservation');
  });

  casper.wait(250, function() {
    this.sendKeys('#search-box','Cambridge Science Festival', {reset: true});
  });

  //Their Partner Org: KIPP
  casper.wait(250, function() {
    this.fillSelectors('form#reservationForm', {
      'select': "3"
    }, false);
    this.click('.insertReservation');
  });

  casper.wait(250, function() {
    test.assertExists('.removeReservation');
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});
