casper.test.comment('Signing In');

casper.test.begin('Landing Page', 17, function suite(test) {
  casper.start(homeURL, function() {
  });
  
  casper.waitForSelector("#lnkSignUp", function() {
    this.click("#lnkSignUp");
  });

  //signup should appear in 1s or less
  casper.wait(1000, function() {
    test.assertExists("#firstName");
    test.assertExists("#lastName");
    test.assertExists("#userEmail");
    test.assertExists("#userPassword");
    test.assertExists("#next");
  });

  casper.then(function() {
    this.sendKeys("#firstName", "CasperJS");
    this.sendKeys("#lastName", "User");
    this.sendKeys("#userEmail", "casperjs@gmail.com");
    this.sendKeys("#userPassword", "casperrules");

    this.click("#next");
  });

  casper.waitForSelector('#street1', function() {
    test.assertExists('#street1');
    test.assertExists('#street2');
    test.assertExists('#city');
    test.assertExists('#state');
    test.assertExists('#zip');
    test.assertExists('#organizations');
    test.assertExists('#incomeBrackets');
    test.assertExists('#numberOfKids');
    test.assertExists('#races');
    test.assertExists('#submit');
  });

  casper.then(function() {
    this.sendKeys('#street1', '500 Mass Ave');
    this.sendKeys('#street2', 'Apt 2');
    this.sendKeys('#city', 'Boston');
    this.sendKeys('#state', 'MA');
    this.sendKeys('#zip', '02118');
    this.click('#submit');
  });

  casper.waitForSelector('#lnkCheckIn', function() {
    test.assertExists("#lnkCheckIn");
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});
