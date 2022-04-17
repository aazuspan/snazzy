var testing = require("users/aazuspan/tests:tests");
var snazzy = require("users/aazuspan/snazzy:styles");

var tests = {};


// Test that the style asset is publicly accessible
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
  snazzy.addStyleFromTags(["colorful", "light"], "fav", "favorites");  
  snazzy.addStyleFromTags(["colorful", "light"], "views", "views");  
  snazzy.addStyleFromTags(["colorful", "light"], "rand", "random");  
}


testing.runTests(tests)