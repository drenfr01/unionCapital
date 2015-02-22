casper.test.begin('Landing Page', 7, function suite(test) {
  casper.start(homeURL, function() {
    casper.loginAsUser();
  });
  
  casper.waitForSelector("#quickCheckIn", function() {
    test.assertExists("#takePhoto");
    test.assertExists(".fb_iframe_widget");
    test.assertExists(".UCB-nav-logo");
    test.assertExists("#signOut");
  });

  casper.run(function() {
    test.done();
  });
});
