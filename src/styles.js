exports.tags = require("users/aazuspan/snazzy:src/tags.js");
exports.styleAsset = "projects/ee-aazuspan/assets/snazzy/styles";
exports.styles = ee.FeatureCollection(exports.styleAsset);

var HELP = "\
\n░░░░░░░ ░░░    ░░  ░░░░░  ░░░░░░░ ░░░░░░░ ░░    ░░ \
\n▒▒      ▒▒▒▒   ▒▒ ▒▒   ▒▒    ▒▒▒     ▒▒▒   ▒▒  ▒▒  \
\n▒▒▒▒▒▒▒ ▒▒ ▒▒  ▒▒ ▒▒▒▒▒▒▒   ▒▒▒     ▒▒▒     ▒▒▒▒   \
\n     ▓▓ ▓▓  ▓▓ ▓▓ ▓▓   ▓▓  ▓▓▓     ▓▓▓       ▓▓    \
\n███████ ██   ████ ██   ██ ███████ ███████    ██    \
\n\nInfo: https://github.com/aazuspan/snazzy\
\nStyles: https://SnazzyMaps.com\
\n\n██▓▓▒▒▒▒░░░░░░         IMPORT SNAZZY       ░░░░░░▒▒▒▒▓▓██\
\n╔═══════════════════════════════════════════════════════╗\
\n║ var snazzy = require('users/aazuspan/snazzy:styles'); ║\
\n╚═══════════════════════════════════════════════════════╝\
\n\n██▓▓▒▒▒▒░░░░░░          ADD A STYLE        ░░░░░░▒▒▒▒▓▓██\
\n╔═══════════════════════════════════════════════════════╗\
\n║ snazzy.addStyle(url, alias);                          ║\
\n╚═══════════════════════════════════════════════════════╝\
\n\n██▓▓▒▒▒▒░░░░░░     ADD MULTIPLE STYLES     ░░░░░░▒▒▒▒▓▓██\
\n╔═══════════════════════════════════════════════════════╗\
\n║ snazzy.addStyles({url: alias, url: alias, ...});      ║\
\n╚═══════════════════════════════════════════════════════╝\
\n\n██▓▓▒▒▒▒░░░░░░     ADD A RANDOM STYLE      ░░░░░░▒▒▒▒▓▓██\
\n╔═══════════════════════════════════════════════════════╗\
\n║ snazzy.addStyleFromTags([tags], alias, 'random')      ║\
\n╚═══════════════════════════════════════════════════════╝\
\n\n██▓▓▒▒▒▒░░░░░░     ADD A POPULAR STYLE     ░░░░░░▒▒▒▒▓▓██\
\n╔═══════════════════════════════════════════════════════╗\
\n║ snazzy.addStyleFromTags([tags], alias, 'views');      ║\
\n╚═══════════════════════════════════════════════════════╝\
\n\n██▓▓▒▒▒▒░░░░░░     ADD A STYLE BY NAME     ░░░░░░▒▒▒▒▓▓██\
\n╔═══════════════════════════════════════════════════════╗\
\n║ snazzy.addStyleFromName(name, alias);                 ║\
\n╚═══════════════════════════════════════════════════════╝\
"

exports.help = function() {
  print(HELP);
}


// Added styles are automatically stored in this global
var activeStyles = {};


// Add a single style from a URL
exports.addStyle = function(url, alias) {
  var style = getStyleFromProperty("url", url);
  return addStyleToMap(style, alias);
}


// Add multiple styles from a mapping of URLs to names
exports.addStyles = function(styles) {
  var properties = [];
  for (var url in styles) {
    properties.push(exports.addStyle(url, styles[url]));
  }
  return properties;
}


// Add the first style with a given name, sorted by favorites.
exports.addStyleFromName = function(name, alias) {
  var style = getStyleFromProperty("name", name, "favorites");
  return addStyleToMap(style, alias);
}


// Add the first style that matches a set of tags, sorted by "favorites", "views", or "random".
exports.addStyleFromTags = function(tags, alias, order) {
  var style = getStyleFromTags(tags, order);
  return addStyleToMap(style, alias);
}


// Sort all the exported styles by favorites, views, or random
var sortStyles = function(order) {
  order = order || "favorites";
  if (order != "views" && order != "favorites" && order != "random") {
    throw new Error("Order should be 'favorites', 'views', or 'random', not '" + order + "'.");
  }
  
  var styles = exports.styles;
  if (order === "random") {
    styles = styles.randomColumn({columnName: "random", seed: ee.Date(Date.now()).millis()});
  }
  
  var sorted = styles.sort(order, false);
  // Remove the random column, if it was added. If not, this has no effect.
  var props = styles.first().propertyNames().remove("random");
  return sorted.select(props);
}


// Get the first style from the collection that matches all of the given tags
var getStyleFromTags = function(tags, order) {
  var tagFilter = buildCompoundTagFilter(tags);
  
  var sorted = sortStyles(order);
  var style = sorted.filter(tagFilter).first().getInfo();
  
  if (style == null) {
    throw new Error("No styles matched all the selected tags...");
  }
  
  return style;
}


// Get the first style from the collection where a given property matches a given value.
var getStyleFromProperty = function(property, value, order) {
  var sorted = sortStyles(order);
  var style = sorted.filter(ee.Filter.equals(property, value)).first().getInfo();
  
  if (style == null) {
    throw new Error("Style with " + property + " '" + value + "' could not be found...");
  }
  
  return style;
}


// Add a style to the map from a client-side Feature objet
var addStyleToMap = function(style, alias) {
  alias = alias || style["properties"]["name"];
  
  // Prevent overwriting existing styles
  if (activeStyles[alias] != null) {
    throw new Error("A style with alias '" + alias + "' already exists! Style aliases must be unique (or null).");
  }
  
  var styleJSON = JSON.parse(style["properties"]["json"]);
  activeStyles[alias] = styleJSON;
  
  Map.setOptions(alias, activeStyles);
  return style["properties"];
}


// Iteratively build a filter to match against all tags in an array of tags
var buildCompoundTagFilter = function(tags) {
  // If null or empty tags are provided, create a filter that returns everything
  if (tags == null || tags.length == 0)
    return ee.Filter.always();
    
  // If tags is a single string, turn it into an array
  tags = [].concat(tags);
  
  for (var i=0; i<tags.length; i++) {
    var tag = tags[i];
    if (exports.tags.indexOf(tag) === -1) {
      throw new Error("'" + tag + "' is not a recognized tag. Choose from: " + exports.tags);
    }
    
    if (i === 0) 
      var filter = ee.Filter.stringContains("tags", tags[0]);
    else
      filter = ee.Filter.and(filter, ee.Filter.stringContains("tags", tag));
  }
  
  return filter;
}