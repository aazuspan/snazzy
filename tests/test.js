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
  var func = function() {snazzy.addStyle("https://invalidurl.biz")};
  testing.assertThrows(func, Error);
}

// Test that an invalid style name throws an error
tests.testBadName = function() {
  var func = function() {snazzy.addStyleFromName("SDJfDSJFKdjfKDSLJF394ujFDK0f2")};
  testing.assertThrows(func, Error);
}

// Test that an invalid tag throws an error
tests.testBadTag = function() {
  var func = function() {snazzy.addStyleFromTags(["invalid-tag"])};
  testing.assertThrows(func, Error);
}

// Test that an invalid sort order throws an error
tests.testBadOrder = function() {
  var func = function() {snazzy.addStyleFromTags(["colorful"], null, "invalid")};
  testing.assertThrows(func, Error);
}


testing.runTests(tests);