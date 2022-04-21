var snazzy = require("users/aazuspan/snazzy:styles");
var should = require("users/aazuspan/should:test");


should.utils.call(function() {
  var style = snazzy.styleAsset;
  var acl = ee.data.getAssetAcl(style);
  should.beTrue(acl["all_users_can_read"], "Check style asset is public");
});


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
  snazzy.addStyle("https://invalidurl.biz");
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