//This file has utility methods for the CasperJS tests in the test/ directory

siteName = 'Union Capital';
homeURL = "http://localhost:3000/login";
casper.options.logLevel = "debug";

user = "casperjs@gmail.com";
newPassword = "duncan";

parterAdmin = 'laura@gmail.com';
partnerAdminPassword = 'admin';

superAdmin = "admin@gmail.com";
superAdminPassword = "admin";

casper.loginAsUser = function loginAsUser() {
  casper.capture("start.png");
  this.waitForSelector("#loginSubmit", function() {
    this.sendKeys("#userEmail", user);
    this.sendKeys("#userPassword", newPassword);
    this.click("#loginSubmit");
  });
};

casper.loginAsPartnerAdmin = function loginAsPartnerAdmin() {
  casper.capture("start.png");
  this.waitForSelector("#loginSubmit", function() {
    this.sendKeys("#userEmail", parterAdmin);
    this.sendKeys("#userPassword", partnerAdminPassword);
    this.click("#loginSubmit");
  });
};


casper.loginAsSuperAdmin = function loginAsSuperAdmin() {
  this.waitForSelector("#loginSubmit", function() {
    this.sendKeys("#userEmail", superAdmin);
    this.sendKeys("#userPassword", superAdminPassword);
    this.click("#loginSubmit");
  });
};


casper.logout = function logout(test) {
  casper.then(function() {
    this.click("#login-dropdown-list");
  });
  
  casper.waitForSelector("#login-buttons-logout", function() {
    this.click("#login-buttons-logout");
  });

  casper.waitWhileSelector("#login-buttons-logout", function() {
    test.assertExists("#loginSubmit");
  });

};
