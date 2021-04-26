/***
 *
 * @param {Object} node
 * @constructor
 */
function FAttributes(node) {
    this.$$node = node;
    Object.defineProperty(this, '_definedProperties', {
        enumerable: false,
        writable: false,
        value: {}
    });
}

Object.defineProperty(FAttributes.prototype, 'loadAttributeHandlers', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (newDescriptors) {
        var self = this;
        var definedDescriptors = this._definedProperties;
        Object.keys(this._definedProperties).forEach(function (key) {
            if (definedDescriptors[key] !== newDescriptors[key]) {
                delete definedDescriptors[key];
                delete self[key];
            }
        });
        Object.keys(definedDescriptors).forEach(function (key) {
            if (definedDescriptors[key] !== newDescriptors[key]) {
                self.defineProperty(key, newDescriptors[key]);
            }
        });
    }
});

Object.defineProperty(FAttributes.prototype, 'defineProperty', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (name, descriptor) {
        var self = this;
        this._definedProperties[name] = descriptor;

        var privateValue = undefined;
        var objectDescriptor = {
            enumerable: true, configurable: true,
            set: function (value) {
                if (descriptor.set)
                    privateValue = descriptor.set.call(self.$$node, value);
                else privateValue = value;
            },
            get: function () {
                if (descriptor.get)
                    return descriptor.get.call(self.$$node, value);
                else
                    return privateValue;
            }
        };

        Object.defineProperty(this, name, objectDescriptor);
        if (value !== undefined) this[name] = value;
    }
});

Object.defineProperty(FAttributes.prototype, 'export', {
    enumerable: false,
    configurable: true,
    value: function () {
        var self = this;
        return Object.keys(this).reduce(function (ac, key) {
            var value;
            var exporter = self._definedProperties.export;
            if (exporter) {
                value = exporter.call(self.$$node);
            }
            else {
                value = self[key]
            }
            if (value !== undefined) ac[key] = value;
            return ac;
        });
    }
});


export default FAttributes;
