# Snazzy

[Snazzy Maps](https://snazzymaps.com) styles in the [Google Earth Engine](https://earthengine.google.com/) code editor.

![Snazzy basemap demo](assets/snazzy_demo.gif)

## Description

- 🗺️ Customize your Earth Engine basemap in any script or App
- ✨ Add any style from [Snazzy Maps](https://snazzymaps.com) with one line of code
- 🗒️ Check out the [example script](https://code.earthengine.google.com/0f9f840270816d2151d64fa5c80a26b9) for a quick interactive demo

## Usage

Import the `snazzy` module into your Earth Engine script.

```javascript
var snazzy = require("users/aazuspan/snazzy:styles");
```

Add a style from [Snazzy Maps](https://snazzymaps.com/explore) to your map by copying the URL and pasting in your Earth Engine script:

```javascript
snazzy.addStyle("https://snazzymaps.com/style/235815/retro");
```

Optionally, you can name your style by passing a second parameter. This name will show up at the top right corner of the Map UI.

```javascript
snazzy.addStyle("https://snazzymaps.com/style/235815/retro", "Retro!");
```

Your map can have multiple custom styles at once. Just make sure they have unique names or new styles will overwrite the old styles. The last style you add will be set as the active style.

```javascript
snazzy.addStyle("https://snazzymaps.com/style/235815/retro", "Retro");
snazzy.addStyle("https://snazzymaps.com/style/13/neutral-blue", "Blue");
snazzy.addStyle("https://snazzymaps.com/style/8097/wy", "WY");
```

## Details

[@TC25](https://github.com/TC25) wrote [a great tutorial](https://developers.google.com/earth-engine/tutorials/community/customizing-base-map-styles) on how you can customize Earth Engine basemaps using styles from Snazzy Maps. However, that technique requires adding a long style string to every script. `snazzy` stores all ~25,000 style descriptions currently on Snazzy Maps in one big public Feature Collection (`projects/ee-aazuspan/assets/snazzy_styles`). When you request a style, `snazzy` queries that collection to find the right style and adds it to your map for you.

Note: Because `snazzy` accesses styles from a copy of the Snazzy Maps database, recently added styles may be unavailable. If you find a missing style, feel free to open an issue and I'll try to get it added.
