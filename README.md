# Snazzy

[Snazzy Maps](https://snazzymaps.com) styles in the [Google Earth Engine](https://earthengine.google.com/) code editor.

![Snazzy basemap demo](assets/snazzy_demo.gif)

## Description

- 🗺️ Customize your Earth Engine basemap in any script or App
- ✨ Add any style from [Snazzy Maps](https://snazzymaps.com) with one line of code
- 🗒️ Check out the [example script](https://code.earthengine.google.com/d0fbb0ab2a2daf37e4fc8ce066484edd) for a quick interactive demo

## Usage

Import the `snazzy` module into your Earth Engine script.

```javascript
var snazzy = require("users/aazuspan/snazzy:styles");
```

### Add a Single Style
Add a style from [Snazzy Maps](https://snazzymaps.com/explore) to your map by copying the URL and pasting in your Earth Engine script:

```javascript
snazzy.addStyle("https://snazzymaps.com/style/235815/retro");
```

Optionally, you can name your style by passing a second parameter. This name will show up at the top right corner of the Map UI.

```javascript
snazzy.addStyle("https://snazzymaps.com/style/235815/retro", "Retro!");
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

### Add a Random Style

If you don't feel like digging through the Snazzy Maps collection, `snazzy.surpriseMe` adds a random style to the map. If you want to be able to find the style again make sure to print it!

```javascript
print(snazzy.surpriseMe());
```

What if you already have an aesthetic or color scheme in mind? Try passing in an array of tags and/or colors. Now the style will be chosen randomly from the styles that match *all* your criteria.

```javascript
snazzy.surpriseMe(["monochrome", "yellow", "black", "two-tone"]);
```

`Snazzy` supports all of the tags and colors used by Snazzy Maps. To see them in the code editor: `print(snazzy.tags)`.

- **Tags**: `colorful, complex, dark, greyscale, light, monochrome, no-labels, simple, two-tone`
- **Colors**: `black, blue, grey, green, orange, purple, red, white, yellow`

### Find Popular Styles

Need more help deciding on a style and don't want to leave the code editor? `snazzy.listStyles(n)` will list the top `n` styles. You can optionally use a list of tags to filter the results and choose whether to sort by views or favorites.

```javascript
var popular = snazzy.listStyles(5, ["grey", "blue", "no-labels"], "views");
```

Print the list to see their URLs or just get the most popular and add it directly to your map!

```javascript
print(popular);
snazzy.addStyle(popular.get(0), "Popular grey-blue");
```

## Details

[@TC25](https://github.com/TC25) wrote [a great tutorial](https://developers.google.com/earth-engine/tutorials/community/customizing-base-map-styles) on how you can customize Earth Engine basemaps using styles from Snazzy Maps. However, that technique requires adding a long style string to every script. `snazzy` stores all ~25,000 style descriptions currently on Snazzy Maps in one big public Feature Collection (`projects/ee-aazuspan/assets/snazzy_styles`). When you request a style, `snazzy` queries that collection to find the right style and adds it to your map for you.

Note: Because `snazzy` accesses styles from a copy of the Snazzy Maps database, recently added styles may be unavailable. If you find a missing style, feel free to open an issue and I'll try to get it added.
