casper.test.comment('Signing In');

casper.test.begin('Landing Page', 27, function suite(test) {
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
    test.assertExists('#inputAddress');
    test.assertExists('#street_number');
    test.assertExists('#route');
    test.assertExists('#userStreetAddress2');
    test.assertExists('#locality');
    test.assertExists('#administrative_area_level_1');
    test.assertExists('#postal_code');
    test.assertExists('#genderForm');
    test.assertExists('#numberOfKids');
    test.assertExists('#races');
    test.assertExists('#reducedLunchForm');
    test.assertExists('#medicaid');
    test.assertExists('#organizations'); //Partner Org
    test.assertExists('#followingOrgs');
    test.assertExists('#deviceForm');

    test.assertExists('#back');
    test.assertExists('#next');
  });

  /* Couldn't get autocomplete testing to work
  casper.then(function() {
    this.page.includeJs('https://maps.googleapis.com/maps/api/js?key=AIzaSyBScqNB3QtZ1_8t41CAYGBW0ZvPLXhJ0eM&sensor=true&libraries=places');
    this.sendKeys('#inputAddress', '10 Emerson Place, Boston, MA', {reset: true, 
                  keepFocus: true});

  });

  casper.wait(250, function() {
    
    test.assertExists('div.pac-item');
    this.page.injectJs('../../jquery-1.11.2.min.js');
    this.evaluate(function() {
      $('#inputAddress').focus();
    });
    this.capture('autocomplete.png');
  });

  */

  casper.wait(250, function() {
    
    //checking Google autocomplete
    this.sendKeys('#street_number', '10');
    this.sendKeys('#route', 'Emerson Pl');
    this.sendKeys('#userStreetAddress2', '24H');
    this.sendKeys('#locality', 'Boston');
    this.sendKeys('#administrative_area_level_1', 'MA');
    this.sendKeys('#postal_code', '02114');


    this.fillSelectors('form#organizationForm', {
      'select[id="organizations"]': "KIPP Academy Boston"
    }, false);

    this.fillSelectors('form#numberOfKidsForm', {
      'select[id="numberOfKids"]': "1"
    }, false);

    this.fillSelectors('form#raceForm', {
      'select[id="races"]': "Black or African-American"
    }, false);

    this.page.injectJs('../../moment.js');

    this.evaluate(function() {
      $("#genderForm input[id='male']").prop('checked', true);
      $("#medicaid input[id='yes']").prop('checked', true);
      $("#reducedLunchForm input[id='yes']").prop('checked', true);
    });


    this.fillSelectors('form#deviceForm', {
      'select[id="device"]': "Mobile phone"
    }, false);

    this.capture('autocomplete.png');
    this.click('#next');

  });

  casper.waitForSelector('.accept-terms', function() {
    test.assertExists('#next');
    test.assertTextExists('End User License Agreement');
    this.click('#next');
  });

  casper.wait(500, function() {
    test.assertTextExists('Please check the box');
    this.click('#accept-eula');
    this.click('#next');
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
