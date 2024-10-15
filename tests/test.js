var snazzy = require("users/aazuspan/snazzy:src/entry.js");
var should = require("users/aazuspan/should:test");

should.bePublic(snazzy.styleAsset, "Check style asset is public");

should.utils.call(function() {
  var url = "https://snazzymaps.com/style/8097/wy";
  
  function callbackTest(data) {
    var keys = Object.keys(data["properties"]);
    var expectedKeys = ["favorites", "json", "name", "tags", "url", "views"];
    should.equal(keys, expectedKeys, "Evaluated keys should match expected.");
    should.equal(data["properties"]["url"], url, "Evaluated URL should match requested.")
  }
  snazzy.addStyle(url, "alias", callbackTest);
})

should.notThrow(function() {
  snazzy.addStyleFromName("Retro");
}, "Add style by name");


should.notThrow(function() {
  snazzy.addStyle("https://snazzymaps.com/style/8097/wy");
}, "Add style by URL");


should.notThrow(function() {
  var styles = {
      "https://snazzymaps.com/style/13/neutral-blue": null,
      "https://snazzymaps.com/style/15/subtle-grayscale": null
  };
  snazzy.addStyles(styles);
}, "Add multiply styles by URL");


should.notThrow(function() {
  snazzy.addStyleFromTags(["colorful", "light"], "rand", "random");  
}, "Add style from tags");


should.throw(function() {
  snazzy.addStyle();
}, "Invalid URL throws error");


should.throw(function() {
  snazzy.addStyleFromName("SDJfDSJFKdjfKDSLJF394ujFDK0f2");
}, "Invalid name throws error");


should.throw(function() {
  snazzy.addStyleFromTags(["invalid-tag"]);
}, "Invalid tag throws error");


should.throw(function() {
  snazzy.addStyleFromTags(["colorful"], null, "invalid");
}, "Invalid sort order throws error");