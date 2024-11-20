/**
 * A minimal implementation of an association list that stores key-value pairs in an array.
 * 
 * Compared to a JS object, this allows for using any object type as a key.
 */
function AssociationList() {
    this.elements = [];

    // Return all keys
    this.keys = function () {
        return this.elements.map(function (pair) { return pair[0] });
    };

    // Return all values
    this.values = function () {
        return this.elements.map(function (pair) { return pair[1] });
    };

    // Push a new key-value pair. If the key already exists, it will be replaced.
    this.push = function (key, value) {
        var idx = this.keys().indexOf(key);
        if (idx !== -1) {
            // If the key is already set, replace it
            this.elements[idx] = [key, value];
        }
        else {
            this.elements.push([key, value]);
        }
    }

    // Retrieve a value by key
    this.get = function (key) {
        var idx = this.keys().indexOf(key);
        if (idx !== -1) {
            return this.elements[idx][1];
        }
    }

    // Check if the key exists
    this.contains = function (key) {
        return this.keys().indexOf(key) !== -1;
    }
}

exports = {
    AssociationList: AssociationList
}