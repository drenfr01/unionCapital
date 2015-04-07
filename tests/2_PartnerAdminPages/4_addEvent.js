casper.test.comment("Testing Partner Admin Add Events");

casper.test.begin('Add Partner Events', 17, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsPartnerAdmin();
  });
  
  casper.waitForSelector("#login-dropdown-list", function() {
    test.assertExists('#manageEvents');
    this.click('#manageEvents');
  });

  casper.waitWhileSelector('#manageEvents',function() {
    test.assertExists('#addEvent');
    this.click('#addEvent');
  });

  casper.waitWhileSelector('#addEvent', function() {
    test.assertTextExists('Add Event'); 
    test.assertExists("input[name=name]");
    test.assertExists("input[name=address]");
    test.assertExists("input[name=url]");
    test.assertExists("input[name=description]");
    test.assertExists("select[name=institution]");
    test.assertExists("select[name=category]");
    test.assertExists("input[name=eventDate]");
    test.assertExists("input[name=duration]");
    test.assertExists("input[name=isPointsPerHour]");
    test.assertExists("input[name=points]");

    test.assertExists('#back');
    test.assertExists('#geocodeButton');
  });

  //create event
  casper.then(function() {
    this.sendKeys("input[name=name]", newPartnerEvent);
    this.sendKeys("input[name=description]", newPartnerEventDesc);
    this.sendKeys("input[name=url]", 'www.districthall.com');
    this.sendKeys("input[name=address]", newPartnerAddress);

    this.fillSelectors('form#insertEventsForm', {
      'select[name="institution"]': "KIPP Academy"
    }, false);

    this.fillSelectors('form#insertEventsForm', {
      'select[name="category"]': "Health (Physical & Mental)"
    }, false);

    this.page.injectJs('../../moment.js');

    var formattedTime = this.evaluate(function() {
      var eventDate = new Date();
      var numberOfDays = 3;
      var result = new Date(eventDate);
      result.setDate(eventDate.getDate() + numberOfDays);
      return moment(result).format('MM/DD/YYYY hh:mm a');
    });

    this.sendKeys('input[name=eventDate]', formattedTime);
    this.sendKeys('input[name=duration]', "3");
    this.click("input[name=isPointsPerHour]");
    this.sendKeys("input[name=points]", '150');

    this.click('#geocodeButton');
  });

  casper.waitForSelector('#submit', function() {
    this.click('#submit');
  });

  casper.wait(250, function() {
    this.click('#back');
  });

  casper.waitWhileSelector('#geocodeButton', function(){
    test.assertTextExists(newPartnerEvent);
  });

  casper.then(function() {
    casper.logout(test);
  });
  
  casper.run(function() {
    test.done();
  });
});

