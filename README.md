# Snazzy

[Snazzy Maps](https://snazzymaps.com) styles in the [Google Earth Engine](https://earthengine.google.com/) code editor.

![Snazzy basemap demo](assets/snazzy_demo.gif)

## Description

- 🗺️ Customize your Earth Engine basemap in any script or App
- ✨ Add any style from [Snazzy Maps](https://snazzymaps.com) with one line of code
- 🗒️ Check out the [example script](https://code.earthengine.google.com/b1bfa398bbae12b6a707d2f36f3a2708) for a quick interactive demo

## Usage

Import the `snazzy` module into your Earth Engine script.

```javascript
var snazzy = require("users/aazuspan/snazzy:styles");
```

### Add a Single Style
Add a style from [Snazzy Maps](https://snazzymaps.com/explore) to your map by copying the URL and pasting in your Earth Engine script with `snazzy.addStyle`. The second parameter will be assigned as the style name.

```javascript
snazzy.addStyle("https://snazzymaps.com/style/235815/retro", "Retro");
```

### Add Multiple Styles

Your map can have multiple custom styles at once. You can do this is by using `addStyle` multiple times, or by passing an object with URLs and unique style names to `addStyles`:

```javascript
var styles = {
    "https://snazzymaps.com/style/235815/retro": "Retro",
    "https://snazzymaps.com/style/13/neutral-blue": "Blue",
    "https://snazzymaps.com/style/8097/wy": "WY"
}
snazzy.addStyles(styles);
```

### Add a Style Using Tags

Know the aesthetic or color scheme but don't have a specific style in mind? You can use `snazzy.addStyleFromTags` to add a popular or random style that matches your criteria. Just pass in an array of [tags/colors](#snazzy-tags) and a style name to assign.

```javascript
snazzy.addStyleFromTags(["yellow", "black", "two-tone"], "Yellow");
```

By default, `addStyleFromTags` adds the most popular style that matches all your tags, sorted by `favorites`, but you can also sort by `views` (or `random` for a surprise).

```javascript
snazzy.addStyleFromTags(["colorful", "no-labels", "simple"], "Colorful", "random");
```

### Snazzy Tags

`Snazzy` supports all of the tags and colors used by Snazzy Maps. To see them in the code editor: `print(snazzy.tags)`.

- **Tags**: `colorful, complex, dark, greyscale, light, monochrome, no-labels, simple, two-tone`
- **Colors**: `black, blue, grey, green, orange, purple, red, white, yellow`

## Details

[@TC25](https://github.com/TC25) wrote [a great tutorial](https://developers.google.com/earth-engine/tutorials/community/customizing-base-map-styles) on how you can customize Earth Engine basemaps using styles from Snazzy Maps. However, that technique requires adding a long style array to every script. `snazzy` stores all ~25,000 style descriptions currently on Snazzy Maps in one big public Feature Collection (`snazzy.styles`). When you request a style, `snazzy` queries that collection to find the right style and adds it to your map for you.
