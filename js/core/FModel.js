function FModel() {
    this.attributes = {};
}


/**
 * @returns {Array<String>}
 */
FModel.prototype.getAcceptsAttributeNames = function () {
    return [];
};


/**
 * @param {String} name
 * @returns {}
 */
FModel.prototype.getAttributeDescriptor = function (name) {
    var functionName = 'getAttribute' + name.substr(0, 1).toUpperCase() + name.substr(1) + 'Descriptor';
    return this[functionName] && this[functionName].apply(this, Array.prototype.slice.call(arguments, 1));
};

/**
 * @returns {}
 */
FModel.prototype.getAttributeDescriptors = function () {
    var result = {};
    var names = this.getAcceptsAttributeNames();
    var key;
    for (var i = 0; i < names.length; ++i) {
        key = names[i];
        result[key] = this.getAttributeDescriptor(key);
    }
    return result;
};


/**
 * @param {String} name
 * @param {} value
 * @returns {} value which is set
 */
FModel.prototype.setAttribute = function (name, value) {
    var functionName = 'setAttribute' + name.substr(0, 1).toUpperCase() + name.substr(1);
    var res = value;
    if (this[functionName]) {
        res = this[functionName].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    this.attributes[name] = res;
    return res;
};


/**
 * @param {String} name
 * @returns {} value which is set
 */
FModel.prototype.getAttribute = function (name) {
    var functionName = 'getAttribute' + name.substr(0, 1).toUpperCase() + name.substr(1);
    if (this[functionName]) {
        return this[functionName].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    return this.attributes[name];
};


FModel.prototype.getAttributes = function () {
    var self = this;
    var attributeKeys = Object.keys(this.attributes).filter(function (key) {
        return self.attributes[key] !== undefined || self.attributes[key] !== null;
    });

    if (attributeKeys.length > 0) {
        return attributeKeys.reduce(function (ac, key) {
            ac[key] = self.getAttribute(key);
            return ac;
        }, {});
    }
    return null;
};

FModel.prototype.setAttributes = function (attributes) {
    var self = this;
    Object.keys(attributes).forEach(function (key) {
        self.setAttribute(key, attributes[key]);
    });
};


export default FModel;