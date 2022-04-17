var testing = require("users/aazuspan/tests:tests");
var snazzy = require("users/aazuspan/snazzy:styles");

var tests = {};

tests.testCollectionIsPublic = function() {
    var style = snazzy.styleAsset;
    var acl = ee.data.getAssetAcl(style);
    if (acl["all_users_can_read"] !== true) {
        throw new Error("Collection is not public!");
    }
}

tests.testStyleFromName = function() {
  snazzy.addStyleFromName("Retro");
}

tests.testStyleFromURL = function() {
  snazzy.addStyle("https://snazzymaps.com/style/8097/wy");
}

tests.testMultipleStyles = function() {
  var styles = {
      "https://snazzymaps.com/style/13/neutral-blue": null,
      "https://snazzymaps.com/style/15/subtle-grayscale": null
  };
  snazzy.addStyles(styles);
}

tests.testStyleFromTags = function() {
  snazzy.addStyleFromTags(["colorful", "light"], "rand", "random");  
}

// Test that an invalid style URL throws an error
tests.testBadUrl = function() {
  var func = snazzy.addStyle;
  var args = ["https://invalidurl.com"];
  testing.assertThrows(func, args, Error);
}

// Test that an invalid style name throws an error
tests.testBadName = function() {
  var func = snazzy.addStyleFromName;
  var args = ["This definitely isn't the name of a real style"];
  testing.assertThrows(func, args, Error);
}

// Test that an invalid tag throws an error
tests.testBadTag = function() {
  var func = snazzy.addStyleFromTags;
  var args = [["invalid-tag"]];
  testing.assertThrows(func, args, Error);
}

// Test that an invalid sort order throws an error
tests.testBadOrder = function() {
  var func = snazzy.addStyleFromTags;
  var args = [["colorful"], null, "invalid"];
  testing.assertThrows(func, args, Error);
}


testing.runTests(tests);