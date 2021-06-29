import EventEmitter from 'absol/src/HTML5/EventEmitter';
import FViewable from './FViewable';
import FNode, {traversal} from './FNode';
import FModel from './FModel';
import PluginManager from './PluginManager';
import FormEditorPreconfig from '../FormEditorPreconfig';
import noop from "absol/src/Code/noop";
import {randomIdent} from "absol/src/String/stringGenerate";
import {randomUniqueIdent} from "./utils";
import CCBlock from "absol/src/AppPattern/circuit/CCBlock";
import inheritComponentClass from "./inheritComponentClass";
import BaseBlock from "./BaseBlock";
import FAttributes from "./FAttributes";
import IndexedPropertyNames from "./IndexedPropertyNames";

var extendAttributeNames = Object.keys(FormEditorPreconfig.extendAttributes);

/***
 * @constructor
 * @augments EventEmitter
 * @augments FViewable
 * @augments FNode
 * @augments BaseBlock
 */
function BaseComponent() {
    EventEmitter.call(this);
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
    this.events = new FAttributes(this);
    this.dataBindingDescriptor = this.createDataBindingDescriptor();
    this.compiledEvents = {};
    this.onCreated();
}

inheritComponentClass(BaseComponent, FViewable, FNode, BaseBlock);


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

BaseComponent.prototype.attributeHandlers.name = {
    set: function (value) {
        var ref = arguments[arguments.length - 1];
        var prev = ref.get();
        value = value || randomUniqueIdent();
        value = value + '';
        this.domElt.attr('data-fm-name', value);
        if (value !== prev) this.unbindDataInFragment();
        ref.set(value);
        this.bindDataToFragment();
        return value;
    },
    getDescriptor: function () {
        var root = this;
        while (root.parent && !root.formType) {
            root = root.parent;
        }
        var names = {};
        var self = this;

        function visit(node) {
            if (node !== self) {
                names[node.attributes.name] = node;
            }
            node.children.forEach(visit);
        }

        visit(root);

        return {
            type: 'uniqueText',
            others: names,
            regex: /^[a-zA-Z_0-9]$/
        };
    }
}

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

BaseComponent.prototype.attributeHandlers.disembark = {
    set: function (value, ref) {
        if (value !== false || value === 'false') value = true;
        else value = false;
        ref.set(value);
        this.updateEmbark();
        return value;
    },
    export: function (ref) {
        var value = ref.get();
        if (!value) return undefined;
        return !!value;
    },
    descriptor: {
        type: 'bool'
    }
};

BaseComponent.prototype.attributeHandlers.dataBinding = {
    set: function (value) {
        var ref = arguments[arguments.length - 1];
        value = !!value;
        ref.set(value);
        if (value) {
            this.bindDataToFragment();
        }
        else {
            this.unbindDataInFragment();
        }
        return value;
    },
    descriptor: { type: 'bool' }
}


BaseComponent.prototype.onCreate = function () {
    this.constructor.count = this.constructor.count || 0;
    this.attributes.name = this.tag + "_" + (this.constructor.count++);
    this.attributes.embark = true;
    this.attributes.dataBinding = true;
    var self = this;
    extendAttributeNames.forEach(function (name) {
        var func = FormEditorPreconfig.extendAttributes[name].getDefault;
        if (func) self.attributes[name] = func.call(self);
    });
};

BaseComponent.prototype.onCreated = noop;


BaseComponent.prototype.onAnchorAttached = noop;

BaseComponent.prototype.onAnchorDetached = noop;


BaseComponent.prototype.onAttached = noop;

BaseComponent.prototype.onFragmentAttached = noop;

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
            if (child.isFragmentView) {
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
    var dict = Object.assign({}, this.styleHandlers);
    if (this.anchor)
        Object.assign(dict, this.anchor.styleHandlers)
    var names = Object.keys(dict);
    var indexed = IndexedPropertyNames;
    names.sort(function (a, b) {
        return indexed[a] - indexed[b];
    });
    return names;
};


BaseComponent.prototype.measureMinSize = function () {
    return { width: 0, height: 0 };
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


BaseComponent.prototype.getAttributeDataBindingDescriptor = function () {
    return {
        type: 'bool',
        value: !!this.attributes.dataBinding,
        default: true
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

BaseComponent.prototype.updateEmbark = function () {
    if (!this.fragment || !this.fragment.view) return;
    var self = this;
    var parent = this.parent;
    var disembark = this.attributes.disembark;
    while (parent && parent.isFragmentView) {
        if (parent.attributes.disembark)
            break;
        parent = parent.parent;
    }
    if (parent) return;
    var fragment = this.fragment;
    if (disembark) {
        this.domElt.addClass('as-disembark');
        if (this.anchor)
            this.anchor.domElt.addClass('as-disembark');
    }
    else {
        this.domElt.removeClass('as-disembark');
        if (this.anchor)
            this.anchor.domElt.removeClass('as-disembark');
    }
    traversal(this, function (path) {
        var node = path.node;
        node.bindDataToFragment(disembark);
        if ((node != self && node.attributes.disembark) || node.fragment !== fragment) {
            path.skipChildren();
        }
    });

};


BaseComponent.prototype.createDataBindingDescriptor = function () {

};

/***
 *
 * @param {boolean=} parentDisembark
 */
BaseComponent.prototype.bindDataToFragment = function (parentDisembark) {
    if (!this.fragment) return;
    var name = this.attributes.name;
    if (!name) return;
    var boundProp = this.fragment.boundProps[name];
    if (boundProp === this) return;
    var descriptor = this.dataBindingDescriptor;
    if (!descriptor) return;
    if (!this.attributes.dataBinding) return;
    var obj = this.fragment.props;
    Object.assign(descriptor, {
        enumerable: !this.attributes.disembark && !parentDisembark,
        configurable: true
    });
    Object.defineProperty(obj, name, descriptor);
    this.fragment.boundProps[name] = this;
};

BaseComponent.prototype.unbindDataInFragment = function () {
    if (!this.fragment) return;
    var name = this.attributes.name;
    if (!name) return;
    var boundProp = this.fragment.boundProps[name];
    if (boundProp !== this) return;
    var obj = this.fragment.props;
    delete obj[name];
    delete this.fragment.boundProps[name];
};

BaseComponent.prototype.notifyChange = function () {
    var bounded;
    if (this.attributes.dataBinding && this.fragment) {
        bounded = this.fragment.boundProps[this.attributes.name];
        if (bounded) {
            if (bounded === this || (bounded.indexOf && bounded.indexOf(this) >= 0)) {
                this.fragment.notifyPropsChange();
            }
        }

    }
}


Object.defineProperty(BaseComponent.prototype, 'view', {
    get: function () {
        return this.domElt;
    }
});


Object.defineProperty(BaseComponent.prototype, 'isFragmentView', {
    get: function () {
        return this.fragment && this.fragment.view === this;
    }
});

export default BaseComponent;

