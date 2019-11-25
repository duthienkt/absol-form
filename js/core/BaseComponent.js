import EventEmitter from 'absol/src/HTML5/EventEmitter';
import FViewable from './FViewable';
import FNode from './FNode';
import FModel from './FModel';
import PluginManager from './PluginManager';

function BaseComponent() {
    EventEmitter.call(this);
    this.events = {};
    FViewable.call(this);
    FNode.call(this);
    FModel.call(this);
    this.anchorAcceptsStyleName = {};
    this.onCreate();
    this.view = this.render();
    this.view.classList.add(this.BASE_COMPONENT_CLASS_NAME);
    this.onCreated();
}

Object.defineProperties(BaseComponent.prototype, Object.getOwnPropertyDescriptors(EventEmitter.prototype));
Object.defineProperties(BaseComponent.prototype, Object.getOwnPropertyDescriptors(FViewable.prototype));
Object.defineProperties(BaseComponent.prototype, Object.getOwnPropertyDescriptors(FNode.prototype));
Object.defineProperties(BaseComponent.prototype, Object.getOwnPropertyDescriptors(FModel.prototype));
BaseComponent.prototype.constructor = BaseComponent;



BaseComponent.prototype.tag = "BaseComponent";
BaseComponent.prototype.menuIcon = "span.mdi.mdi-package-variant-closed";

BaseComponent.prototype.BASE_COMPONENT_CLASS_NAME = 'as-base-component';

BaseComponent.prototype.anchor = null;

BaseComponent.prototype.SUPPORT_STYLE_NAMES = [];

BaseComponent.prototype.onCreate = function () {
    this.constructor.count = this.constructor.count || 0;
    this.attributes.name = this.tag + "_" + (this.constructor.count++);
};

BaseComponent.prototype.onCreated = function () {
    this.updateAttributes();
};

BaseComponent.prototype.onAnchorAttached = function () {
    this.anchorAcceptsStyleName = this.anchor.getAcceptsStyleNames().reduce(function (ac, key) { ac[key] = true; return ac; }, {});
};

BaseComponent.prototype.onAnchorDetached = function () {
    this.anchorAcceptsStyleName = {};
};



BaseComponent.prototype.onAttached = function (parent) {
    this.updateStyle();

};

BaseComponent.prototype.updateStyle = function () {
    for (var key in this.style) {
        this.setStyle(key, this.style[key]);
    }
};

BaseComponent.prototype.updateAttributes = function () {
    for (var key in this.attributes) {
        this.setAttribute(key, this.attributes[key]);//set init attribute
    }
};


BaseComponent.prototype.getData = function () {
    var self = this;
    var data = {
        tag: this.tag
    }

    var attributeKeys = Object.keys(this.attributes).filter(function (key) {
        return self.attributes[key] !== undefined || self.attributes[key] !== null;
    });

    if (attributeKeys.length > 0) {
        data.attributes = attributeKeys.reduce(function (ac, key) {
            ac[key] = self.attributes[key];
            return ac;
        }, {});
    }

    var styleKeys = Object.keys(this.style).filter(function (key) {
        return self.style[key] !== undefined || self.style[key] !== null;
    });

    if (styleKeys.length > 0) {
        data.style = styleKeys.reduce(function (ac, key) {
            ac[key] = self.style[key];
            return ac;
        }, {});
    }

    var eventsKeys = Object.keys(this.events).filter(function (key) {
        return self.events[key] !== undefined || self.events[key] !== null;
    });

    if (eventsKeys.length > 0) {
        data.events = eventsKeys.reduce(function (ac, key) {
            ac[key] = self.events[key];
            return ac;
        }, {});
    }

    if (this.children.length > 0) {
        data.children = this.children.map(function (child) {
            return child.getData();
        });
    }

    return data;
}



BaseComponent.prototype.fire = function (name) {
    EventEmitter.prototype.fire.apply(this, arguments);
    if (this.events[name]) {
        PluginManager.exec(this, 'EXEC_SCRIPT', this.events[name], Array.prototype.slice.call(arguments, 1));
    }
    return this;
};

BaseComponent.prototype.setEvents = function (events) {
    for (var name in events) {
        this.setEvent(name, events[name]);
    }
};

BaseComponent.prototype.setAttributes = function (attributes) {
    for (var name in attributes) {
        this.setAttribute(name, attributes[name]);
    }
};

BaseComponent.prototype.setStyles = function (styles) {
    for (var name in styles) {
        this.setStyle(name, styles[name]);
    }
};

BaseComponent.prototype.setEvent = function (key, value) {
    if (value === undefined) {
        delete this.events[key];
    }
    else
        this.events[key] = value;
    return value;
};


BaseComponent.prototype.getAcceptsStyleNames = function () {
    if (this.anchor)
        return this.anchor.getAcceptsStyleNames();
    return [];
};

BaseComponent.prototype.getStyleDescriptor = function (name) {
    var res;
    res = FViewable.prototype.getStyleDescriptor.call(this, name);
    if (this.anchor)
        res = res || this.anchor.getStyleDescriptor(name);
    return res;
};

BaseComponent.prototype.reMeasure = function () {
    if (this.parent && this.parent.reMeasure)
        this.parent.reMeasureChild(this);
};


BaseComponent.prototype.measureMinSize = function () {
    return { width: 0, height: 0 };
}

BaseComponent.prototype.getAcceptsAttributeNames = function () {
    return ["type", "name"];
};

BaseComponent.prototype.getAcceptsEventNames = function () {
    return [];
};

/**
 * @param {String} name
 * @returns {}
 */
FModel.prototype.getEventDescriptor = function (name) {
    var functionName = 'getEvent' + name.substr(0, 1).toUpperCase() + name.substr(1) + 'Descriptor';
    return this[functionName] && this[functionName].call(this);
};

BaseComponent.prototype.getAttributeTypeDescriptor = function () {
    return {
        type: 'const',
        value: this.tag
    };
};


BaseComponent.prototype.getAttributeNameDescriptor = function () {
    return {
        type: 'text',
        regex: /^[a-zA-Z\_0-9]$/
    };
};


export default BaseComponent;