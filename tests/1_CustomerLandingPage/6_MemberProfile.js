casper.test.comment("Testing Edit Member Profile");

var newAddress = "4 Emerson Place";
var newApartment = "12F";
var newIncomeBracket = "25,000-29,999"; 
var newNumberOfKids = 3;

casper.test.begin('Member Profile Page', 16, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsUser();
  });

  casper.waitForSelector("#totalPointsDiv", function() {
    this.click("#login-dropdown-list");
  });

  casper.waitForSelector("#login-buttons-edit-profile", function() {
    this.click("#login-buttons-edit-profile");
  });

  casper.waitForSelector("#edit", function() {
    test.assertTextExists("CasperJS");
    test.assertTextExists("casperjs@gmail.com");
    test.assertTextExists("10 Emerson Place");
    test.assertTextExists("24H");
    test.assertTextExists("Boston");
    test.assertTextExists("MA");
    test.assertTextExists("02114");
    test.assertTextExists("KIPP Academy Boston");
    test.assertTextExists("1");
    test.assertTextExists("African-American or Black");

    this.click("#edit");
  });

  casper.waitForSelector("#submit", function() {
    this.sendKeys("#street1", newAddress, {reset: true});
    this.sendKeys("#street2", newApartment, {reset: true});
    this.fillSelectors('form#numberOfKidsForm', {
      'select[id="numberOfKids"]': newNumberOfKids
    }, false);
    
    this.click("#submit");
  });

  casper.waitForSelector("#edit", function() {
    test.assertTextExists(newAddress);
    test.assertTextExists(newApartment);
    test.assertTextExists(newNumberOfKids);
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});
