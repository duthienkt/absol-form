/***
 *
 * @param {Object} node
 * @constructor
 */
import Ref from "absol/src/AppPattern/Ref";

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

    Object.defineProperty(this, '_definedComputedHandlers', {
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
        var definedComputedHandlers = this._definedComputedHandlers;
        Object.keys(this._definedProperties).forEach(function (key) {
            if (!newHandlers[key]) {
                delete definedHandlers[key];
                delete definedComputedHandlers[key];
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
        var hadValue = !!(name in this);
        var privateValueRef = new Ref(this[name]);
        var objectDescriptor = {
            enumerable: true, configurable: true,
            set: function (value) {
                if (handler.set)
                    privateValueRef.set(handler.set.apply(self.$$node, Array.prototype.slice.call(arguments).concat([privateValueRef])));
                else privateValueRef.set(value);
            },
            get: function () {
                if (handler.get)
                    return handler.get.apply(self.$$node, Array.prototype.slice.call(arguments).concat([privateValueRef]));
                else
                    return privateValueRef.get();
            }
        };


        Object.defineProperty(this, name, objectDescriptor);
        this._definedComputedHandlers[name] = objectDescriptor;
        objectDescriptor.ref = privateValueRef;
        if (hadValue) this[name] = privateValueRef.get();
    }
});

Object.defineProperty(FAttributes.prototype, 'getProperty', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (name) {
        var args = Array.prototype.slice.call(arguments, 1);
        var handler = this._definedComputedHandlers[name];
        if (handler) {
            return handler.get.apply(this, args);
        }
        else return this[name];
    }
});

Object.defineProperty(FAttributes.prototype, 'setProperty', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (name, value) {
        var args = Array.prototype.slice.call(arguments, 1);
        var handler = this._definedComputedHandlers[name];
        if (handler) {
            return handler.set.apply(this, args);
        }
        else
            this[name] = value;
    }
});


Object.defineProperty(FAttributes.prototype, 'export', {
    enumerable: false,
    configurable: true,
    value: function () {
        var self = this;
        return Object.keys(this).reduce(function (ac, key) {
            var value;
            var handler = self._definedProperties[key];
            var computedHandler = self._definedComputedHandlers[key];
            var exporter = handler && handler.export;
            if (exporter) {
                value = exporter.call(self.$$node, computedHandler.ref);
            }
            else {
                value = self[key]
            }
            if (value !== undefined) ac[key] = value;
            return ac;
        }, {});
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
        return (handler && handler.descriptor) || { type: typeof value }
    }
});

export default FAttributes;
