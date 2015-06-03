casper.test.comment("Testing Non-KIPP Member Reservations");

casper.test.begin('Reservations Page', 4, function suite(test) {
  casper.start(homeURL, function() {
    this.waitForSelector("#loginSubmit", function() {
      this.sendKeys("#userEmail", "user2@gmail.com");
      this.sendKeys("#userPassword", "user");
      this.click("#loginSubmit");
    });
  });

  casper.waitForSelector("#login-dropdown-list", function() {
    this.clickLabel('What\'s Happening in Boston', 'a');
  });

  casper.waitForSelector('#search-box', function() {
    this.sendKeys('#search-box', 'Cambridge Film Festival');
  });

  //Ensure user can RSVP for events of both their partnerOrg and others
  //Other Partner Org (in this case Thrive in Five)
  //Also ensure that 1 user RSVP-ing doesn't affect other
  //users
  casper.wait(250, function() {

    this.fillSelectors('form#reservationForm', {
      'select': "4"
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
      'select': "5"
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
