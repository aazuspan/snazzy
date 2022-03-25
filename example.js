// Load the Snazzy module
var snazzy = require("users/aazuspan/snazzy:styles");

// Add a single style by passing in a URL and a name.
snazzy.addStyle("https://snazzymaps.com/style/14889/flat-pale", "Pale");

// Add multiple styles at once by making an object mapping URLs to unique names.
var styles = {
    "https://snazzymaps.com/style/235815/retro": "Retro",
    "https://snazzymaps.com/style/13/neutral-blue": "Blue",
    "https://snazzymaps.com/style/8097/wy": "WY"
}
snazzy.addStyles(styles);

// Add a random style that matches a set of tags or colors
snazzy.surpriseMe(["two-tone", "simple", "red", "black"], "Random")

// Find the 5 most viewed styles that match a set of tags and add the top result
var popular = snazzy.listStyles(5, ["colorful", "light", "complex"], "views");
snazzy.addStyle(popular.get(0), "Popular")

// Snazzy contains a help function that prints a few helpful reminders.
snazzy.help();
