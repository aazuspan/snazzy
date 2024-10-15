# Snazzy

[![Earth Engine Javascript](https://img.shields.io/badge/Earth%20Engine%20API-Javascript-red)](https://developers.google.com/earth-engine/tutorials/tutorial_api_01)
[![Open in Code Editor](https://img.shields.io/badge/Open%20in-Code%20Editor-9cf)](https://code.earthengine.google.com/eea55338fa02e2b114e8cd70431302d8)

[Snazzy Maps](https://snazzymaps.com) styles in the [Google Earth Engine](https://earthengine.google.com/) code editor.

![Snazzy basemap demo](assets/snazzy_demo.gif)

## TLDR

- 🗺️ Customize your Earth Engine basemap in any script or App
- ✨ Add any style from [Snazzy Maps](https://snazzymaps.com) by URL, name, or tags with one line of code
- 🆒 Add any [Font Awesome free icon](https://fontawesome.com/search?m=free&o=r) to your widgets with one line of code
- ⚡ Asynchronous evaluation for fast, non-blocking execution

## Usage

Import the `snazzy` module into your Earth Engine script.

```javascript
var snazzy = require("users/aazuspan/snazzy:styles");
```

### Add a Style Using a URL
Add a style from [Snazzy Maps](https://snazzymaps.com/explore) to your map by copying the URL and pasting in your Earth Engine script with `snazzy.addStyle`. The second parameter is optional and will be assigned as the style alias (displayed in the top right of the map). If no alias (or `null`) is provided, the name of the style on Snazzy Maps will be used.

```javascript
snazzy.addStyle("https://snazzymaps.com/style/235815/retro", "My Custom Style");
```

### Add a Style Using a Name

You can also add a style by name rather than URL. However, there may be multiple styles with the same name. `snazzy` will always add the most popular style that matches a given name, so use a URL if selecting by name doesn't give you the style you want.

```javascript
snazzy.addStyleFromName("Retro");
```

### Add a Style Using Tags

Know the aesthetic or color scheme but don't have a specific style in mind? You can use `snazzy.addStyleFromTags` to add a popular or random style that matches your criteria. Just pass in an array of [tags/colors](#snazzy-tags) and an alias.

```javascript
snazzy.addStyleFromTags(["yellow", "black", "two-tone"]);
```

By default, `addStyleFromTags` adds the most popular style that matches all your tags, sorted by `favorites`, but you can also sort by `views` (or `random` for a surprise).

```javascript
var tags = ["colorful", "no-labels", "simple"];
var alias = null;
var order = "random";

var style = snazzy.addStyleFromTags(tags, alias, order);
print(style);
```

Note that all functions that add styles return the style feature, which can be printed to reveal the URL and other metadata.

### Snazzy Tags

`Snazzy` supports all of the tags and colors used by Snazzy Maps. To see them in the code editor: `print(snazzy.tags)`.

- **Tags**: `colorful, complex, dark, greyscale, light, monochrome, no-labels, simple, two-tone`
- **Colors**: `black, blue, grey, green, orange, purple, red, white, yellow`

### Font Awesome Icons

`ui.Label` and `ui.Button` widgets support image icons. Find a free icon from [Font Awesome](https://fontawesome.com/search?m=free&o=r) and assign it to your widget with `snazzy.icons.setIcon`:

```js
var widget = ui.Button();
var iconName = "fa-dog";
var iconSize = 32;

snazzy.icons.setIcon(widget, iconName, iconSize);
print(widget);
```

To avoid the icon appearing after the widget is displayed, `setIcon` also takes an optional callback function that will be called with the widget after loading, e.g.:

```js
var widget = ui.Button();
var iconName = "fa-dog";
var iconSize = 32;

snazzy.icons.setIcon(widget, iconName, iconSize, function(loadedWidget) {
    print("Widget icon loaded!");
    Map.add(loadedWidget);
});
```

## Acknowledgements

- [@adamkrogh](https://github.com/adamkrogh) is the creator of [Snazzy Maps](https://snazzymaps.com) 👏

- [@TC25](https://github.com/TC25) wrote [a great tutorial](https://developers.google.com/earth-engine/tutorials/community/customizing-base-map-styles) on how you can manually add Snazzy Maps styles to the Earth Engine code editor, which inspired this module. 
