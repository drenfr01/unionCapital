casper.test.comment('Signing In');

casper.test.begin('Landing Page', 18, function suite(test) {
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
    test.assertExists("#submit");
  });

  casper.then(function() {
    this.sendKeys("#firstName", "CasperJS");
    this.sendKeys("#lastName", "User");
    this.sendKeys("#userEmail", "casperjs@gmail.com");
    this.sendKeys("#userPassword", "casperrules");

    this.click("#submit");
  });

  casper.waitWhileSelector('#userPassword', function(){
    test.assertExists('#street1');
    test.assertExists('#street2');
    test.assertExists('#city');
    test.assertExists('#state');
    test.assertExists('#zip');
    test.assertExists('#organizations');
    test.assertExists('#incomeBrackets');
    test.assertExists('#numberOfKids');
    test.assertExists('#races');

    test.assertExists('#back');
    test.assertExists('#submit');
  });

  casper.then(function() {
    this.sendKeys('#street1', '10 Emerson Place');
    this.sendKeys('#street2', '24H');
    this.sendKeys('#city', 'Boston');
    this.sendKeys('#state', 'MA');
    this.sendKeys('#zip', '02114');

    this.fillSelectors('form#organizationForm', {
      'select[id="organizations"]': "KIPP Academy"
    }, false);

    this.fillSelectors('form#incomeBracketForm', {
      'select[id="incomeBrackets"]': "10,000-19,999"
    }, false);

    this.fillSelectors('form#numberOfKidsForm', {
      'select[id="numberOfKids"]': "1"
    }, false);

    this.fillSelectors('form#raceForm', {
      'select[id="races"]': "African-American or Black"
    }, false);

    this.click('#submit');
  });

  casper.wait(3000, function() {
    test.assertExists("#checkInDiv");
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});
