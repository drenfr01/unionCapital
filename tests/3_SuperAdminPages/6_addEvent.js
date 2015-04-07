casper.test.comment("Testing Super Admin Add Event");

casper.test.begin('Add Event', 18, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsSuperAdmin();
  });
  
  //check home page main panel
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

  //create past event
  casper.then(function() {
    this.sendKeys("input[name=name]", 'Casper Event');
    this.sendKeys("input[name=address]", '184 High St, Boston, MA, 02110');
    this.sendKeys("input[name=url]", 'www.howlatthemoon.com/boston/');
    this.sendKeys("input[name=description]", 'Dueling Piano Bar');

    this.fillSelectors('form#insertEventsForm', {
      'select[name="institution"]': "KIPP Academy"
    }, false);

    this.fillSelectors('form#insertEventsForm', {
      'select[name="category"]': "Health (Physical & Mental)"
    }, false);

    var eventDate = new Date();
    var numberOfDays = -1;
    var result = new Date(eventDate);
    result.setDate(eventDate.getDate() + numberOfDays);

    this.page.injectJs('../../moment.js');

    var formattedTime = this.evaluate(function() {
      var eventDate = new Date();
      var numberOfDays = -1;
      var result = new Date(eventDate);
      result.setDate(eventDate.getDate() + numberOfDays);
      return moment(result).format('MM/DD/YYYY hh:mm a');
    });

    this.sendKeys('input[name=eventDate]', formattedTime);
    this.sendKeys('input[name=duration]', "4");
    this.click("input[name=isPointsPerHour]");
    this.sendKeys("input[name=points]", '250');

    this.click('#geocodeButton');
  });

  casper.waitForSelector('#submit', function() {
    this.click('#submit');
  });

  casper.wait(250, function() {
    this.click('#back');
  });

  casper.waitWhileSelector('#geocodeButton', function(){
    this.click('#past');
  });

  casper.wait(500, function(){
    test.assertTextExists('Casper Event');
    //TODO: this is bug where the manage events 
    //screen doesn't reload on the current screen
    //by default
    this.click('#current');
  });
  
  casper.wait(500, function() {
    this.click('#addEvent');
  });

  //Create future event
  casper.waitWhileSelector('#addEvent', function() {
    this.sendKeys("input[name=name]", 'Casper Future Event');
    this.sendKeys("input[name=address]", '184 High St, Boston, MA, 02110');
    this.sendKeys("input[name=url]", 'www.howlatthemoon.com/boston/');
    this.sendKeys("input[name=description]", 'Dueling Piano Bar');

    this.fillSelectors('form#insertEventsForm', {
      'select[name="institution"]': "KIPP Academy"
    }, false);

    this.fillSelectors('form#insertEventsForm', {
      'select[name="category"]': "Health (Physical & Mental)"
    }, false);


    this.page.injectJs('../../moment.js');

    var formattedTime = this.evaluate(function() {
      var eventDate = new Date();
      var numberOfDays = 1;
      var result = new Date(eventDate);
      result.setDate(eventDate.getDate() + numberOfDays);
      return moment(result).format('MM/DD/YYYY hh:mm a');
    });

    this.sendKeys('input[name=eventDate]', formattedTime);
    this.sendKeys('input[name=duration]', "5");
    this.click("input[name=isPointsPerHour]");
    this.sendKeys("input[name=points]", '250');

    this.click('#geocodeButton');
  });

  casper.waitForSelector('#submit', function() {
    this.click('#submit');
  });

  casper.wait(250, function() {
    this.click('#back');
  });

  casper.waitWhileSelector('#geocodeButton', function(){
    this.click('#current');
  });

  casper.wait(500, function() {
    test.assertTextExists('Casper Future Event');
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});

