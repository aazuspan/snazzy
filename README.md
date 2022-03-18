# Snazzy

[Snazzy Maps](https://snazzymaps.com) styles in the [Google Earth Engine](https://earthengine.google.com/) code editor.

![Snazzy basemap demo](assets/snazzy_demo.gif)

## Description

- 🗺️ Customize your Earth Engine basemap in any script or App
- ✨ Add any style from [Snazzy Maps](https://snazzymaps.com) with one line of code
- 🗒️ Check out the [example script](https://code.earthengine.google.com/1e8695463920c24bd2cc8efc7f63f9bf) for an interactive intro to `Snazzy`

## Usage

Import the `snazzy` module into your Earth Engine script.

```javascript
var snazzy = require("users/aazuspan/snazzy:styles");
```

Add a single style from [Snazzy Maps](https://snazzymaps.com/explore) by copying the URL and pasting in your Earth Engine script:

```javascript
snazzy.addStyle("https://snazzymaps.com/style/235815/retro");
```

Optionally, you can name your style by passing a second parameter. This name will show up at the top right corner of the Map UI.

```javascript
snazzy.addStyle("https://snazzymaps.com/style/235815/retro", "Retro!");
```

Whenever you call `addStyle`, it returns an array of your active styles. To add multiple styles to your map, you can pass that style array back in each time you add a new style. This will allow you to switch back and forth between multiple styles.

```javascript
var styles = {};
styles = snazzy.addStyle("https://snazzymaps.com/style/235815/retro", "Retro!", styles);
styles = snazzy.addStyle("https://snazzymaps.com/style/13/neutral-blue", "Blue", styles);
```

## Details

[@TC25](https://github.com/TC25) wrote [a great tutorial](https://developers.google.com/earth-engine/tutorials/community/customizing-base-map-styles) on how you can customize Earth Engine basemaps using styles from Snazzy Maps. However, that technique requires adding a long style string to every script. `snazzy` stores all ~25,000 style descriptions currently on Snazzy Maps in one big public Feature Collection (`projects/ee-aazuspan/assets/snazzy_styles`). When you request a style, `snazzy` queries that collection to find the right style and adds it to your map for you.

Note: Because `snazzy` accesses styles from a copy of the Snazzy Maps database, recently added styles may be unavailable. If you find a missing style, feel free to open an issue and I'll try to get it added.
