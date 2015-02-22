//This file has utility methods for the CasperJS tests in the test/ directory

siteName = 'Union Capital';
homeURL = "http://localhost:3000/login";
casper.options.logLevel = "debug";

user = "casperjs@gmail.com";
newPassword = "duncan";

casper.loginAsUser = function loginAsUser() {
  this.waitForSelector("#loginSubmit", function() {
    this.sendKeys("#userEmail", user);
    this.sendKeys("#userPassword", newPassword);
  });
};
