casper.test.comment('Signing In');

casper.test.begin('Landing Page', 8, function suite(test) {
  casper.start(homeURL, function() {
  });
  
  casper.waitForSelector("#forgotPassword", function() {
    this.click("#forgotPassword");
  });

  casper.wait(1000, function(){
    test.assertExists("#userEmail");
    test.assertExists("#newPassword");
    test.assertExists("#confirmPassword");

    test.assertExists("#submit");
    test.assertExists("#back");
  });

  casper.then(function() {
    this.sendKeys("#userEmail", user);
    this.sendKeys("#newPassword", newPassword);
    this.sendKeys("#confirmPassword", newPassword);

    this.click("#submit");
  });

  casper.wait(1000, function() {
    this.capture('signUpPage.jpg');
    test.assertExists("#loginSubmit");

    this.sendKeys("#userEmail", user);
    this.sendKeys("#userPassword", newPassword);
    
    this.click("#loginSubmit");
  });

  casper.wait(1000, function() {
    test.assertExists("#lnkCheckIn");
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});
