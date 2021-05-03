import FAttributes from "./FAttributes";

function FViewable() {
    var style = new FAttributes(this);
    Object.defineProperty(this, 'style', {
        enumerable: true,
        set: function (value) {
            Object.assign(style, value)
        },
        get: function () {
            return style;
        }
    });
}


/**
 * @returns {Array<String>}
 */
FViewable.prototype.getAcceptsStyleNames = function () {
    return [];
};

/***
 * @returns {AElement}
 */
FViewable.prototype.render = function () {
    throw new Error('Not Implement');
};

/**
 * @param {String} name
 * @returns {}
 */
FViewable.prototype.getStyleDescriptor = function (name) {
    var functionName = 'getStyle' + name.substr(0, 1).toUpperCase() + name.substr(1) + 'Descriptor';
    return (this[functionName] && this[functionName].apply(this, Array.prototype.slice.call(arguments, 1)))
        || this.style.getPropertyDescriptor(name);
};


/**
 * @returns {}
 */
FViewable.prototype.getStyleDescriptors = function () {
    var result = {};
    var names = this.getAcceptsStyleNames();
    var key;
    for (var i = 0; i < names.length; ++i) {
        key = names[i];
        result[key] = this.getStyleDescriptor(key);
    }
    return result;
};


/**
 * @param {String} name
 * @param {*} value
 * @returns {*} value which is set
 */
FViewable.prototype.setStyle = function (name, value) {
    var functionName = 'setStyle' + name.substr(0, 1).toUpperCase() + name.substr(1);
    var res = value;
    if (this[functionName]) {
        res = this[functionName].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    if (res === undefined) {
        delete this.style[name];
    }
    else {
        this.style[name] = res;
    }
    return res;
};


/**
 * @param {String} name
 * @returns {Object} value which is set
 */
FViewable.prototype.getStyle = function (name) {
    var functionName = 'getStyle' + name.substr(0, 1).toUpperCase() + name.substr(1);
    if (this[functionName]) {
        return this[functionName].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    return this.style[name];
};


FViewable.prototype.getStyles = function () {
    var self = this;
    var styleKeys = Object.keys(this.style).filter(function (key) {
        return self.style[key] !== undefined || self.style[key] !== null;
    });

    if (styleKeys.length > 0) {
        return styleKeys.reduce(function (ac, key) {
            ac[key] = self.style[key];
            return ac;
        }, {});
    }
    return null;
};

FViewable.prototype.setStyles = function (styles) {
    var self = this;
    Object.keys(styles).forEach(function (key){
        self.setStyle(key, styles[key]);
    });
};

FViewable.prototype.styleHandlers = {};

export default FViewable;