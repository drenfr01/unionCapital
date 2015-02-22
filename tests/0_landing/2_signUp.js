casper.test.comment('Signing In');

casper.test.begin('Landing Page', 9, function suite(test) {
  casper.start(homeURL, function() {
  });
  
  casper.waitForSelector("#signUp", function() {
    this.click("#signUp");
  });

  //signup should appear in 1s or less
  casper.wait(1000, function() {
    test.assertExists("#firstName");
    test.assertExists("#lastName");
    test.assertExists("#zip");
    test.assertExists("#userEmail");
    test.assertExists("#userPassword");
    test.assertExists("#userPasswordConfirm");
    test.assertExists("#createNewUser");
    test.assertExists("#signIn");
  });

  casper.then(function() {
    this.sendKeys("#firstName", "CasperJS");
    this.sendKeys("#lastName", "User");
    this.sendKeys("#zip", "02144");
    this.sendKeys("#userEmail", "casperjs@gmail.com");
    this.sendKeys("#userPassword", "casperrules");
    this.sendKeys("#userPasswordConfirm", "casperrules");

    this.click("#createNewUser");
  });

  casper.wait(3000, function() {
    test.assertExists("#quickCheckIn");
  });

  casper.then(function() {
    this.click("#signOut");
  });

  casper.run(function() {
    test.done();
  });
});
