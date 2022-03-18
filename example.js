/*
This script contains a few examples on how you can use the Snazzy module
to add basemap styles from Snazzy Maps to your Earth Engine scripts.

Each section of code overwrites the previous section, so run one section,
uncomment the next section, and re-run to see how it changes.
*/

// Load the Snazzy module
var snazzy = require("users/aazuspan/snazzy:styles");

// --------------------------------------------------------------------------
// 1. ADDING A SINGLE STYLE
// Adding a style is as simple as passing in a style URL from SnazzyMaps.com.
// --------------------------------------------------------------------------

snazzy.addStyle("https://snazzymaps.com/style/14889/flat-pale", "Pale");

// --------------------------------------------------------------------------
// 2. ADDING ANOTHER STYLE
// If you add a second style, the first will be overwritten!
// --------------------------------------------------------------------------

// Uncomment the line below to run #2
// snazzy.addStyle("https://snazzymaps.com/style/26527/sin-city", "Red");


// --------------------------------------------------------------------------
// 3. ADDING MULTIPLE STYLES
// If you want multiple styles, store each added style in an array and
// pass it back in when you add another.
// --------------------------------------------------------------------------

// Uncomment the lines below to run #3
// var styles = {};
// styles = snazzy.addStyle("https://snazzymaps.com/style/14889/flat-pale", "Pale");
// styles = snazzy.addStyle("https://snazzymaps.com/style/26527/sin-city", "Red", styles);
// styles = snazzy.addStyle("https://snazzymaps.com/style/4183/mostly-grayscale", "Grayscale", styles);


// --------------------------------------------------------------------------
// 4. GETTING HELP
// Snazzy contains a help function that prints a few helpful reminders.
// --------------------------------------------------------------------------

// snazzy.help();
