//This file has utility methods for the CasperJS tests in the test/ directory

errorCount = 0;

//This is designed to allow a test to logout
//only works with Phantom 1.x apparently, 2.x stops on first error
//casper.options.exitOnError = false;

siteName = 'Union Capital';
homeURL = "http://localhost:3000/login";
casper.options.logLevel = "debug";
casper.test.on('fail', function() {
  if (errorCount ===0)
    casper.capture('screenshots/fail.png');
  errorCount++;
});

user = "casperjs@gmail.com";
newPassword = "duncan";

parterAdmin = 'laura@gmail.com';
partnerAdminPassword = 'admin';

superAdmin = "admin@gmail.com";
superAdminPassword = "admin";

newPartnerEvent = 'Health Clinic';
newPartnerEventDesc = 'A clinic on preventative care for KIPP Academy members';
newPartnerAddress = '75 Northern Ave, Boston, MA 02210';

casper.loginAsUser = function loginAsUser() {
  this.waitForSelector("#loginSubmit", function() {
    this.sendKeys("#userEmail", user);
    this.sendKeys("#userPassword", newPassword);
    this.click("#loginSubmit");
  });
};

casper.loginAsPartnerAdmin = function loginAsPartnerAdmin() {
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

/*
addFakeGeolocation = function(self, latitude, longitude) {
    self.evaluate(function() {
        window.navigator.geolocation = function() {
            var pub = {};
            var current_pos = {
                coords: {
                    latitude: window.__casper_params__.latitude,
                    longitude: window.__casper_params__.longitude
                }
            };
            pub.getCurrentPosition = function(locationCallback,errorCallback) {
                locationCallback(current_pos);
            };
            return pub;
        }();
    }, { latitude: latitude, longitude: longitude });
};
*/
