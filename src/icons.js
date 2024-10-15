function getIconURL(id, size) {
    return exports.icons
        .filter(ee.Filter.eq("id", id))
        .filter(ee.Filter.eq("size", size))
        .first()
        .get("url");
}

/**
 * Set an icon as the imageUrl for a widget.
 * 
 * The icon is loaded and set asynchronously. Use the optional callback to ensure that the widget is loaded.
 * 
 * @param {ui.Label | ui.Button} widget - The widget to set the icon for. Must accept an imageUrl property.
 * @param {string} id - The ID of the icon to set, e.g. "fa-play".
 * @param {number} size - The icon size, in pixels. Supported sizes are 16, 24, 32, 48, and 64.
 * @param {function} callback - An optional callback that is passed the widget once the URL is loaded.
 * @returns {ui.Label | ui.Button} The input widget.
 */
function setIcon(widget, id, size, callback) {
    if (widget.setImageUrl === undefined) {
        throw new Error("Unsupported widget type. Expected Button or Label, got " + widget.constructor.name + ".");
    }

    size = size || 24;
    var supported_sizes = [16, 24, 32, 48, 64];
    if (supported_sizes.indexOf(size) === -1) {
        throw new Error("Unsupported size. Choose from [" + supported_sizes + "].");
    }

    var url = getIconURL(id, size);
    url.evaluate(function (evaluated_url, err) {
        if (err) {
            throw new Error("No icon found with ID '" + id + "'.");
        }
        widget.setImageUrl(evaluated_url);

        if (callback) { callback(widget) }
    });

    return widget;
}

exports = {
    setIcon: setIcon,
    iconsAsset: "projects/ee-aazuspan/assets/snazzy/icons",
    icons: ee.FeatureCollection("projects/ee-aazuspan/assets/snazzy/icons")
}