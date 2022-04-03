exports.styles = ee.FeatureCollection("projects/ee-aazuspan/assets/snazzy_styles");
exports.tags = require("users/aazuspan/snazzy:src/tags.js");

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
\n║ snazzy.addStyle(url, name);                           ║\
\n╚═══════════════════════════════════════════════════════╝\
\n\n██▓▓▒▒▒▒░░░░░░     ADD MULTIPLE STYLES     ░░░░░░▒▒▒▒▓▓██\
\n╔═══════════════════════════════════════════════════════╗\
\n║ snazzy.addStyles({url: name, url: name, ...});        ║\
\n╚═══════════════════════════════════════════════════════╝\
\n\n██▓▓▒▒▒▒░░░░░░     ADD A RANDOM STYLE      ░░░░░░▒▒▒▒▓▓██\
\n╔═══════════════════════════════════════════════════════╗\
\n║ snazzy.addStyleFromTags([tags], name, 'random')       ║\
\n╚═══════════════════════════════════════════════════════╝\
\n\n██▓▓▒▒▒▒░░░░░░     ADD A POPULAR STYLE     ░░░░░░▒▒▒▒▓▓██\
\n╔═══════════════════════════════════════════════════════╗\
\n║ snazzy.addStyleFromTags([tags], name, 'views');       ║\
\n╚═══════════════════════════════════════════════════════╝\
"

exports.help = function() {
  print(HELP);
}

// Query a style by URL from the style collection and return its JSON definition
var styleFromURL = function(styleURL) {
  var style = exports.styles.filterMetadata("url", "equals", styleURL).first().getInfo()
  
  if (style == null) {
    throw "Style " + styleURL + " could not be found...";
  }
  
  return JSON.parse(style["properties"]["json"]);
}

// Added styles are automatically stored in this global
var activeStyles = {};


// Add a single style from a URL
exports.addStyle = function(url, name) {
  name = name || "User Style " + String(Object.keys(activeStyles).length + 1);
  
  // Prevent overwriting existing styles
  if (activeStyles[name] != null) {
    throw "A style with name '" + name + "' already exists! Style names must be unique.";
  }
  
  var style = styleFromURL(url);
  activeStyles[name] = style;
  
  Map.setOptions(name, activeStyles);
  return activeStyles;
}

// Add multiple styles from a mapping of URLs to names
exports.addStyles = function(styles) {
  for (var url in styles) {
    exports.addStyle(url, styles[url]);
  }
}

// Add a random style to the map
exports.surpriseMe = function(tags, name) {
  print("WARNING: snazzy.surpriseMe is deprecated and will be removed soon.\
  Please use snazzy.addStyleFromTags with random order instead.")
  
  return exports.addStyleFromTags(tags, name, "random");
}

// Add the first style that matches a set of tags, sorted by "favorites", "views", or "random".
exports.addStyleFromTags = function(tags, name, order) {
  var matchList = exports.listStyles(1, tags, order).getInfo();
  // Making this check client-side after retrieving the styles is significantly faster
  // than checking the FeatureCollection size during filtering.
  if (matchList.length === 0)
    throw "No styles matched all the selected tags!";

  var url = matchList[0];
  
  exports.addStyle(url, name);
  return url;
}

// Add the first style with a given name, sorted by favorites.
exports.addStyleFromName = function(styleName) {
  var style = exports.styles.filter(ee.Filter.equals("name", styleName)).sort("favorites", false).first().getInfo();
  
  if (style == null) {
    throw "Style " + styleName + " could not be found...";
  }
  
  return JSON.parse(style["properties"]["json"]);
}

// List the URLs of the top n styles that match an optional set of tags, ordered by favorites,
// views, or random.
exports.listStyles = function(n, tags, order) {
  n = n || 10;
  order = order || "favorites";
  if (order != "views" && order != "favorites" && order != "random") {
    throw "Order should be 'favorites', 'views', or 'random', not '" + order + "'.";
  }
  
  var styles = filterStyles(tags);
  
  if (order === "random") {
    styles = styles.randomColumn({columnName: "random", seed: ee.Date(Date.now()).millis()});
  }
  var sorted = styles.sort(order, false);
  
  return sorted.limit(n).aggregate_array("url");
}

// Filter styles to match all given tags. This may return an empty FeatureCollection if 
// no styles match all criteria.
var filterStyles = function(tags) {
  var tagFilter = buildCompoundTagFilter(tags);
  var styles = exports.styles.filter(tagFilter);
  
  return styles;
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
      throw "'" + tag + "' is not a recognized tag. Choose from: " + exports.tags;
    }
    
    if (i === 0) 
      var filter = ee.Filter.stringContains("tags", tags[0]);
    else
      filter = ee.Filter.and(filter, ee.Filter.stringContains("tags", tag));
  }
  
  return filter;
}