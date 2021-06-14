import EventEmitter from 'absol/src/HTML5/EventEmitter';
import FViewable from './FViewable';
import FNode from './FNode';
import FModel from './FModel';
import PluginManager from './PluginManager';
import FormEditorPreconfig from '../FormEditorPreconfig';
import OOP from "absol/src/HTML5/OOP";
import noop from "absol/src/Code/noop";
import {randomIdent} from "absol/src/String/stringGenerate";
import {randomUniqueIdent} from "./utils";
import CCBlock from "absol/src/AppPattern/circuit/CCBlock";

var extendAttributeNames = Object.keys(FormEditorPreconfig.extendAttributes);

/***
 * @constructor
 * @augments EventEmitter
 * @augments FViewable
 * @augments FNode
 * @augments FModel
 */
function BaseComponent() {
    EventEmitter.call(this);
    this.events = {};
    FViewable.call(this);
    FNode.call(this);
    FModel.call(this);
    CCBlock.call(this, { id: randomUniqueIdent() });

    /***
     *
     * @type {FmFragment}
     */
    this.fragment = null;
    this.onCreate();
    /***
     * @type {AElement}
     */
    this.domElt = this.render();
    this.domElt.fmComponent = this;
    this.view.classList.add(this.BASE_COMPONENT_CLASS_NAME);
    this.attributes.loadAttributeHandlers(this.attributeHandlers);
    this.style.loadAttributeHandlers(this.styleHandlers);
    this.onCreated();
}

inheritComponentClass(BaseComponent, EventEmitter, FViewable, FViewable, FModel, FNode);


extendAttributeNames.forEach(function (name) {
    var prototypeConfig = FormEditorPreconfig.extendAttributes[name];
    if (prototypeConfig.setValue)
        BaseComponent.prototype['setAttribute' + name.substr(0, 1).toUpperCase() + name.substr(1)] = prototypeConfig.setValue;
    if (prototypeConfig.getValue)
        BaseComponent.prototype['getAttribute' + name.substr(0, 1).toUpperCase() + name.substr(1)] = prototypeConfig.getValue;
    if (prototypeConfig.getDescriptor)
        BaseComponent.prototype['getAttribute' + name.substr(0, 1).toUpperCase() + name.substr(1) + 'Descriptor'] = prototypeConfig.getDescriptor;
    else console.console.error('FormEditorPreconfig.extendAttributes["' + name + '"] must contains getDescriptor function');
});


BaseComponent.prototype.type = "COMPONENT";
BaseComponent.prototype.tag = "BaseComponent";
BaseComponent.prototype.menuIcon = "span.mdi.mdi-package-variant-closed";

BaseComponent.prototype.BASE_COMPONENT_CLASS_NAME = 'as-base-component';

BaseComponent.prototype.anchor = null;

BaseComponent.prototype.SUPPORT_STYLE_NAMES = [];

BaseComponent.prototype.isLayout = false;

BaseComponent.prototype.attributeHandlers.id = {
    set: function (value) {
        if (!value) value = randomIdent(16);
        this.id = value + '';
    },
    get: function () {
        return this.id;
    },
    getDescriptor: function () {
        return {
            type: 'const',
            value: this.id
        };
    }
};

BaseComponent.prototype.attributeHandlers.tooltip = {
    set: function (value) {
        if (!value) this.domElt.attr('title', undefined);
         else this.domElt.title = value;
    },
    get: function () {
        return this.domElt.title;
    },
    descriptor: {
        type: 'text',
        long: true
    },
    export: function () {
        return this.domElt.title || undefined;
    }
};


BaseComponent.prototype.onCreate = function () {
    this.constructor.count = this.constructor.count || 0;
    this.attributes.name = this.tag + "_" + (this.constructor.count++);
    this.attributes.dataBinding = true;
    var self = this;
    extendAttributeNames.forEach(function (name) {
        var func = FormEditorPreconfig.extendAttributes[name].getDefault;
        if (func) self.attributes[name] = func.call(self);
    });
};

BaseComponent.prototype.onCreated = noop;

/***
 *
 * @param {string} attrName
 * @param {string=}viewPropertyName
 */
BaseComponent.prototype.bindAttribute = function (attrName, viewPropertyName) {
    viewPropertyName = viewPropertyName || attrName;
    var view = this.view;
    Object.defineProperty(this.attributes, attrName, {
        enumerable: true,
        set: function (value) {
            view[viewPropertyName] = value;
        },
        get: function () {
            return view[viewPropertyName];
        }
    });
}

BaseComponent.prototype.onAnchorAttached = noop;

BaseComponent.prototype.onAnchorDetached = noop;


BaseComponent.prototype.onAttached = noop;

BaseComponent.prototype.getData = function () {
    var self = this;
    var data = {
        tag: this.tag
    }

    var key;

    var attributes = this.attributes.export();
    for (key in attributes) {
        data.attributes = attributes;
        break;
    }

    var style = this.style.export();
    for (key in attributes) {
        data.style = style;
        break;
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
            if (child.fragment) {
                var childStyle = child.style.export();
                var childAttributes = child.attributes.export();
                var childData = { class: child.fragment.tag };
                for (key in childStyle) {
                    childData.style = childStyle;
                    break;
                }
                for (key in childAttributes) {
                    childData.attributes = childAttributes;
                    break;
                }
                return childData;
            }
            else {
                return child.getData();
            }
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
    Object.assign(this.attributes, attributes)
};

BaseComponent.prototype.setStyles = function (styles) {
    Object.assign(this.style, styles);
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


BaseComponent.prototype.reMeasure = function () {
    if (this.parent && this.parent.reMeasure)
        this.parent.reMeasureChild(this);
};


BaseComponent.prototype.measureMinSize = function () {
    return { width: 0, height: 0 };
}

BaseComponent.prototype.getAcceptsAttributeNames = function () {
    return ["type", 'id', "name", 'tooltip'].concat(extendAttributeNames)
        .concat((!this.isLayout || this.fragment) ? ['dataBinding'] : [])
        .concat(['irremovable']);
};

BaseComponent.prototype.getAcceptsEventNames = function () {
    return [];
};

/**
 * @param {String} name
 * @returns {}
 */
BaseComponent.prototype.getEventDescriptor = function (name) {
    return { type: 'function' };
};

BaseComponent.prototype.getAttributeTypeDescriptor = function () {
    return {
        type: 'const',
        value: this.tag
    };
};

BaseComponent.prototype.getAttributeIrremovableDescriptor = function () {
    return {
        type: 'const',
        value: !!this.attributes.irremovable
    };
};

BaseComponent.prototype.getAttributeDataBindingDescriptor = function () {
    return {
        type: 'bool',
        value: !!this.attributes.dataBinding,
        default: true
    };
};


BaseComponent.prototype.getAttributeNameDescriptor = function () {
    var root = this;
    while (root.parent && !root.formType) {
        root = root.parent;
    }
    var names = {};
    var self = this;

    function visit(node) {
        if (node != self) {
            names[node.attributes.name] = node;
        }
        node.children.forEach(visit);
    }

    visit(root);

    return {
        type: 'uniqueText',
        others: names,//todo
        regex: /^[a-zA-Z\_0-9]$/
    };
};


BaseComponent.prototype.setStyle = function (name, value) {
    var functionName = 'setStyle' + name.substr(0, 1).toUpperCase() + name.substr(1);
    if (this.anchor && this.anchor[functionName]) {//anchor will handle this
        value = this.anchor.setStyle.apply(this.anchor, arguments);
    }
    // self handle
    return FViewable.prototype.setStyle.apply(this, [name, value].concat(Array.prototype.slice.call(arguments, 2)));
};


BaseComponent.prototype.styleHandlers.width = {
    set: function (value) {
        var unit = arguments.length > 2 ? arguments[1] : undefined;
        var currentValue = this.style.width;
        if (unit === 'px') {//value must be a number
            if ((typeof currentValue == 'string') && this.style.width.match(/%$/)) {
                value = value * 100 / this.domElt.parentElement.getBoundingClientRect().width + '%';
            }
        }
        else if (unit === '%') {
            if (typeof currentValue == 'number') {
                value = value * this.view.parentElement.clientWidth / 100;
            }
        }

        var styleValue = value >= 0 ? value + 'px' : value;
        if (styleValue === 'match_parent') styleValue = '100%';

        if (typeof styleValue == "number")
            this.domElt.addStyle('width', styleValue + 'px');
        else
            this.domElt.addStyle('width', styleValue);
        return value;
    },
    get: function () {
        var unit = arguments.length > 1 ? arguments[0] : undefined;
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        if (unit === 'px') {
            if (typeof value != 'number') {
                return this.domElt.offsetWidth;
            }
            else {
                return value;
            }
        }
        else if (unit === '%') {
            if (((typeof value == 'string') && (!value.match(/%$/)))
                || (typeof value != 'string')) {
                return this.domElt.offsetWidth * 100 / this.domElt.parentElement.clientWidth;
            }
            else {
                return parseFloat(value.replace('%', ''));
            }
        }
        else
            return value;
    },
    descriptor: { type: 'measureSize' }
};

BaseComponent.prototype.styleHandlers.height = {
    set: function (value) {
        var unit = arguments.length > 2 ? arguments[1] : undefined;
        var currentValue = this.style.height;
        if (unit === 'px') {//value must be a number
            if ((typeof currentValue == 'string') && this.style.height.match(/%$/)) {
                value = value * 100 / this.domElt.parentElement.getBoundingClientRect().height + '%';
            }
        }
        else if (unit === '%') {
            if (typeof currentValue == 'number') {
                value = value * this.view.parentElement.clientHeight / 100;
            }
        }

        var styleValue = value >= 0 ? value + 'px' : value;
        if (styleValue === 'match_parent') styleValue = '100%';

        if (typeof styleValue == "number")
            this.domElt.addStyle('height', styleValue + 'px');
        else
            this.domElt.addStyle('height', styleValue);
        return value;

    },
    get: function () {
        var unit = arguments.length > 1 ? arguments[0] : undefined;
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        if (unit === 'px') {
            if (typeof value != 'number')
                return this.domElt.offsetHeight;
            else {
                return value;
            }
        }
        else if (unit === '%') {
            if (((typeof value == 'string') && (!value.match(/%$/)))
                || (typeof value != 'string')) {
                return this.domElt.offsetHeight * 100 / this.domElt.parentElement.clientHeight;
            }
            else {
                return parseFloat(value.replace('%', ''));
            }
        }
        else
            return value;
    },
    descriptor: { type: 'measureSize' }
}


BaseComponent.prototype.setAttributeName = function (value) {
    value = (value + '') || undefined;
    this.domElt.attr('data-attr-name', value);
    return value;
}

/***
 * @returns {PropertyDescriptor||{}|null}
 */
BaseComponent.prototype.getDataBindingDescriptor = function () {
    return null;
};

BaseComponent.prototype.bindDataToObject = function (obj) {
    var name = this.getAttribute('name');
    var descriptor = this.getDataBindingDescriptor();
    if (descriptor) {
        Object.assign(descriptor, { enumerable: true, configurable: true });
        Object.defineProperty(obj, name, descriptor);
    }
    return !!descriptor;
};

Object.defineProperty(BaseComponent.prototype, 'view', {
    get: function () {
        // if (window.ABSOL_DEBUG) {
        //     console.trace('view');
        // }
        return this.domElt;
    }
});

export default BaseComponent;


export function inheritComponentClass(constructor) {
    OOP.mixClass.apply(OOP, arguments);
    var cClass;
    var attributeHandlers = undefined;
    var styleHandlers = undefined;
    var compStyleHandlers = undefined;
    for (var i = 1; i < arguments.length; ++i) {
        cClass = arguments[i];
        if (cClass.prototype.attributeHandlers) {
            attributeHandlers = attributeHandlers || {};
            Object.assign(attributeHandlers, cClass.prototype.attributeHandlers || {});
        }
        if (cClass.prototype.styleHandlers) {
            styleHandlers = styleHandlers || {};
            Object.assign(styleHandlers, cClass.prototype.styleHandlers || {});

        }
        if (cClass.prototype.compStyleHandlers) {
            compStyleHandlers = compStyleHandlers || {};
            Object.assign(compStyleHandlers, cClass.prototype.compStyleHandlers || {});

        }
    }
    if (attributeHandlers)
        constructor.prototype.attributeHandlers = attributeHandlers;
    if (styleHandlers)
        constructor.prototype.styleHandlers = styleHandlers;
    if (compStyleHandlers)
        constructor.prototype.compStyleHandlers = compStyleHandlers;
}