// Load the Snazzy module
var snazzy = require("users/aazuspan/snazzy:styles");

// Add a single style by passing in a URL and a name.
snazzy.addStyle("https://snazzymaps.com/style/14889/flat-pale", "Pale");
// You can have more than 1 style at a time. Just make sure to give them each a unique name.
snazzy.addStyle("https://snazzymaps.com/style/26527/sin-city", "Red");
// The last style added will be set as the active style.
snazzy.addStyle("https://snazzymaps.com/style/4183/mostly-grayscale", "Grayscale");

// Snazzy contains a help function that prints a few helpful reminders.
snazzy.help();
