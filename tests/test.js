var snazzy = require("users/aazuspan/snazzy:styles");
var should = require("users/aazuspan/should:test");

should.bePublic(snazzy.styleAsset, "Check style asset is public");
should.bePublic(snazzy.icons.iconsAsset, "Check icons asset is public");

should.utils.call(function () {
  var url = "https://snazzymaps.com/style/8097/wy";

  function callbackTest(data) {
    var keys = Object.keys(data["properties"]);
    var expectedKeys = ["favorites", "json", "name", "tags", "url", "views"];
    should.equal(keys, expectedKeys, "Evaluated keys should match expected.");
    should.equal(data["properties"]["url"], url, "Evaluated URL should match requested.")
  }
  snazzy.addStyle(url, "alias", undefined, callbackTest);
});

should.match(
  snazzy.addStyle("https://snazzymaps.com/style/8097/wy", "wy2").getString("name"),
  "WY",
  "Returned feature name should match expected."
);

should.notThrow(function () {
  snazzy.addStyleFromName("Retro");
}, "Add style by name");


should.notThrow(function () {
  snazzy.addStyle("https://snazzymaps.com/style/8097/wy");
}, "Add style by URL");


should.notThrow(function () {
  var styles = {
    "https://snazzymaps.com/style/13/neutral-blue": null,
    "https://snazzymaps.com/style/15/subtle-grayscale": null
  };
  snazzy.addStyles(styles);
}, "Add multiply styles by URL");


should.notThrow(function () {
  snazzy.addStyleFromTags(["colorful", "light"], "rand", "random");
}, "Add style from tags");


should.throw(function () {
  snazzy.addStyleFromTags(["invalid-tag"]);
}, "Invalid tag throws error");


should.throw(function () {
  snazzy.addStyleFromTags(["colorful"], null, "invalid");
}, "Invalid sort order throws error");

should.notThrow(function () {
  snazzy.icons.setIcon(ui.Button(), "fa-house", 48);
}, "Set icon without callback");

should.notThrow(function () {
  function check_has_imageurl(widget) {
    var url = widget.getImageUrl();
    should.match(url, "data:image/png;base64,*", "Image URL should match pattern")
  }

  snazzy.icons.setIcon(ui.Button(), "fa-house", 48, check_has_imageurl);
}, "Set icon with callback");


should.throw(function () {
  snazzy.icons.setIcon(ui.Button(), "fa-house", 17);
}, "Invalid icon size should throw")


should.throw(function () {
  snazzy.icons.setIcon(ui.Panel(), "fa-house", 24);
}, "Invalid icon widget should throw")