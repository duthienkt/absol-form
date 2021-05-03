import FAttributes from "./FAttributes";

function FModel() {
    var attributes = new FAttributes(this);
    Object.defineProperty(this, 'attributes', {
        enumerable: true,
        set: function (value) {
            Object.assign(attributes, value)
        },
        get: function () {
            return attributes;
        }
    });
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
    return (this[functionName] && this[functionName].apply(this, Array.prototype.slice.call(arguments, 1)))
        ||this.attributes.getPropertyDescriptor(name);
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
    this.attributes[name] = value;
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
    var res =  Object.assign({}, this.attributes.export());
    for (var key in res){
        return res;
    }
    return null;
};

FModel.prototype.setAttributes = function (attributes) {
    var self = this;
    Object.keys(attributes).forEach(function (key) {
        self.setAttribute(key, attributes[key]);
    });
};


FModel.prototype.attributeHandlers = {};

FModel.prototype.getAttributeHandlers = function () {
    return this.attributeHandlers;
}

export default FModel;