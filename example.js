// Load the Snazzy module
var snazzy = require("users/aazuspan/snazzy:styles");

// Add a single style by passing in a URL and a name.
snazzy.addStyle("https://snazzymaps.com/style/14889/flat-pale", "Pale");

// Add mutliple styles at once by making an object mapping URLs to unique names.
var styles = {
    "https://snazzymaps.com/style/235815/retro": "Retro",
    "https://snazzymaps.com/style/13/neutral-blue": "Blue",
    "https://snazzymaps.com/style/8097/wy": "WY"
}
snazzy.addStyles(styles);

// Snazzy contains a help function that prints a few helpful reminders.
snazzy.help();
