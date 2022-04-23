// Load the Snazzy module
var snazzy = require("users/aazuspan/snazzy:styles");

// Add a style to the map by passing in a URL
snazzy.addStyle("https://snazzymaps.com/style/14889/flat-pale");

// Optionally, provide an alias to overwrite the default style name in the UI
snazzy.addStyle("https://snazzymaps.com/style/28211/street-lights", "My Custom Style");

// Add the most popular style (by favorites) that matches a set of tags.
snazzy.addStyleFromTags(["dark", "simple", "monochrome", "yellow"]);

// Add a random style that matches a set of tags by specifying the sorting order.
// Use the printUrl option to help you find it again.
var order = "random";
snazzy.addStyleFromTags(["no-labels", "simple", "blue"], "Random style", order);

// Add a style by name. If multiple styles have the same name, the most popular
// is added.
snazzy.addStyleFromName("Red Hues");

// Snazzy contains a help function that prints a few helpful reminders.
snazzy.help();
