/***
 *
 * @param {Object} node
 * @constructor
 */
function FAttributes(node) {
    Object.defineProperty(this, '$$node', {
        enumerable: false,
        configurable: true,
        writable: false,
        value: node
    })
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
    value: function (newHandlers) {
        var self = this;
        var definedHandlers = this._definedProperties;
        Object.keys(this._definedProperties).forEach(function (key) {
            if (definedHandlers[key] !== newHandlers[key]) {
                delete definedHandlers[key];
                delete self[key];
            }
        });
        Object.keys(newHandlers).forEach(function (key) {
            if (definedHandlers[key] !== newHandlers[key]) {
                self.defineProperty(key, newHandlers[key]);
            }
        });
    }
});

Object.defineProperty(FAttributes.prototype, 'defineProperty', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (name, handler) {
        var self = this;
        this._definedProperties[name] = handler;

        var privateValue = undefined;
        var objectDescriptor = {
            enumerable: true, configurable: true,
            set: function (value) {
                if (handler.set)
                    privateValue = handler.set.call(self.$$node, value);
                else privateValue = value;
            },
            get: function () {
                if (handler.get)
                    return handler.get.call(self.$$node);
                else
                    return privateValue;
            }
        };

        Object.defineProperty(this, name, objectDescriptor);
        if (privateValue !== undefined) this[name] = privateValue;
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


Object.defineProperty(FAttributes.prototype, 'getPropertyDescriptor', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (name) {
        var handler = this._definedProperties[name];
        if (handler && handler.getDescriptor) return handler.getDescriptor.call(this.$$node);
        var value = this[name];
        return (handler && handler.descriptor) || {type: typeof value}
    }
});


export default FAttributes;
