var eet = require("users/aazuspan/eet:eet");
var snazzy = require("users/aazuspan/snazzy:styles");

eet.test("Style asset is public", function() {
  var style = snazzy.styleAsset;
  var acl = ee.data.getAssetAcl(style);
  eet.assert.strictEqual(
    acl["all_users_can_read"], true, "Collection is not public!"
  );
})

eet.test("Add style by name", function() {
  snazzy.addStyleFromName("Retro");
})

eet.test("Add style by URL", function() {
  snazzy.addStyle("https://snazzymaps.com/style/8097/wy");
})

eet.test("Add multiply styles by URL", function() {
  var styles = {
      "https://snazzymaps.com/style/13/neutral-blue": null,
      "https://snazzymaps.com/style/15/subtle-grayscale": null
  };
  snazzy.addStyles(styles);
})

eet.test("Add style from tags", function() {
  snazzy.addStyleFromTags(["colorful", "light"], "rand", "random");  
})

eet.test("Invalid URL throws error", function() {
  var func = function() {snazzy.addStyle("https://invalidurl.biz")};
  eet.assert.throws(func, Error, new RegExp("could not be found"));
})

eet.test("Invalid name throws error", function() {
  var func = function() {snazzy.addStyleFromName("SDJfDSJFKdjfKDSLJF394ujFDK0f2")};
  eet.assert.throws(func, Error, new RegExp("could not be found"));
})

eet.test("Invalid tag throws error", function() {
  var func = function() {snazzy.addStyleFromTags(["invalid-tag"])};
  eet.assert.throws(func, Error, new RegExp("not a recognized tag"));
})

eet.test("Invalid sort order throws error", function() {
  var func = function() {snazzy.addStyleFromTags(["colorful"], null, "invalid")};
  eet.assert.throws(func, Error, new RegExp("Order should be"));
})


eet.run();
