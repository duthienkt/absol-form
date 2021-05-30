import Fcore from "../core/FCore";
import FViewable from "../core/FViewable";
import '../../css/relativeanchor.css';
import '../../css/alignbox.css';
import OOP from "absol/src/HTML5/OOP";
import {inheritComponentClass} from "../core/BaseComponent";
import makeMapStyleHandler from "./makeMapStyleHandler";

var _ = Fcore._;
var $ = Fcore.$;

/**
 * AnchorBox only has on child node
 * @extends FViewable
 * @constructor
 */
function RelativeAnchor() {
    FViewable.call(this);
    this.childNode = null;
    this.$container = null;

    //for quick binding render
    this.viewBinding = {};

    this.onCreate();
    this.domElt = this.render();
    this.onCreated();
}

inheritComponentClass(RelativeAnchor, FViewable);

RelativeAnchor.prototype.onCreate = function () {/* NOOP */
}

RelativeAnchor.prototype.onCreated = function () {
    for (var key in this.viewBinding) {
        this[key] = $(this.viewBinding[key], this.domElt);
    }
};

RelativeAnchor.prototype.VALIGN_VALUE = ['top', 'bottom', 'center', 'fixed'];
RelativeAnchor.prototype.HALIGN_VALUE = ['left', 'right', 'center', 'fixed'];


RelativeAnchor.prototype.HALIGN_CLASS_NAMES = {
    left: 'as-halign-left',
    right: 'as-halign-right',
    center: 'as-halign-center',
    fixed: 'as-halign-fixed'
};

RelativeAnchor.prototype.VALIGN_CLASS_NAMES = {
    top: 'as-valign-top',
    bottom: 'as-valign-bottom',
    center: 'as-valign-center',
    fixed: 'as-valign-fixed'
};


RelativeAnchor.prototype.getAcceptsStyleNames = function () {
    return ['hAlign', 'vAlign', 'left', 'right', 'top', 'bottom'];
};

RelativeAnchor.prototype.compStyleHandlers = {};

RelativeAnchor.prototype.compStyleHandlers.hAlign = {
    set: function (value) {
        var anchor = this.anchor;
        var ref = arguments[arguments.length - 1];
        var currentValue = ref.get();
        if (!anchor.HALIGN_VALUE.includes(value)) value = anchor.HALIGN_VALUE[0];
        anchor.domElt.removeClass(anchor.HALIGN_CLASS_NAMES[currentValue]);
        anchor.domElt.addClass(anchor.HALIGN_CLASS_NAMES[value]);
        ref.set(value);
        this.style.left = this.style.left + 0;
        this.style.right = this.style.right + 0;
        this.style.width = this.style.width + 0;
        return value;
    },
    descriptor: {
        type: 'enum',
        values: ['left', 'right', 'center', 'fixed'],
        disabled: false,
        sign: 'RelativeAnchor_HAlign'
    }
};

RelativeAnchor.prototype.compStyleHandlers.vAlign = {
    set: function (value) {
        var anchor = this.anchor;
        var ref = arguments[arguments.length - 1];
        var currentValue = ref.get();
        if (!anchor.VALIGN_VALUE.includes(value)) value = anchor.VALIGN_VALUE[0];
        anchor.domElt.removeClass(anchor.VALIGN_CLASS_NAMES[currentValue]);
        anchor.domElt.addClass(anchor.VALIGN_CLASS_NAMES[value]);
        ref.set(value);
        this.style.top = this.style.top + 0;
        this.style.bottom = this.style.bottom + 0;
        this.style.height = this.style.height + 0;
        return value;
    },
    descriptor: {
        type: 'enum',
        values: ['top', 'bottom', 'center', 'fixed'],
        disabled: false,
        sign: 'RelativeAnchor_VAlign'
    }
};

RelativeAnchor.prototype.compStyleHandlers.left = {
    set: function (value) {
        var unit = arguments.length > 2 ? arguments[1] : undefined;
        var ref = arguments[arguments.length - 1];
        var currentValue = ref.get();
        var parentBound;
        if (unit === 'px') {//value must be a number
            if ((typeof currentValue === 'string') && currentValue.match(/%$/)) {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * 100 / parentBound.width + '%';
            }
        }
        else if (unit === '%') {
            if (typeof currentValue === 'number') {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * parentBound.width / 100 + '%';
            }
        }
        var styleValue = value >= 0 ? value + 'px' : value;
        if (this.style.hAlign !== 'center' && this.style.hAlign !== 'right') {
            this.anchor.domElt.addStyle('left', styleValue);
        }
        else this.anchor.domElt.removeStyle('left');

        return value;
    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        var unit = arguments.length > 1 ? arguments[0] : undefined;
        var disabled = this.style.hAlign === 'center' || this.style.hAlign === 'right';
        var bound;
        var parentBound;
        if (unit === 'px') {
            if (typeof value != 'number' || disabled) {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return bound.left - parentBound.left;
            }
            else {
                return value;
            }
        }
        else if (unit === '%') {
            if (((typeof value == 'string') && (!value.match(/%$/)))
                || (typeof value != 'string') || disabled) {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return (bound.left - parentBound.left) * 100 / parentBound.width;
            }
            else {
                return parseFloat(value.replace('%', ''));
            }
        }
        else
            return value;
    },
    getDescriptor: function () {
        return {
            type: 'measurePosition',
            min: -Infinity,
            max: Infinity,
            disabled: this.style.hAlign === 'center' || this.style.hAlign === 'right',
            livePreview: true,
            dependency: ['hAlign', 'right', 'width']
        };
    }
};

RelativeAnchor.prototype.compStyleHandlers.right = {
    set: function (value) {
        var unit = arguments.length > 2 ? arguments[1] : undefined;
        var ref = arguments[arguments.length - 1];
        var currentValue = ref.get();
        var parentBound;
        if (unit === 'px') {//value must be a number
            if ((typeof currentValue === 'string') && currentValue.match(/%$/)) {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * 100 / parentBound.width + '%';
            }
        }
        else if (unit === '%') {
            if (typeof currentValue === 'number') {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * parentBound.width / 100 + '%';
            }
        }
        var styleValue = value >= 0 ? value + 'px' : value;
        if (this.style.hAlign !== 'center' && this.style.hAlign !== 'left') {
            this.anchor.domElt.addStyle('right', styleValue);
        }
        else this.anchor.domElt.removeStyle('right');
        return value;
    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        var unit = arguments.length > 1 ? arguments[0] : undefined;
        var disabled = this.style.hAlign === 'center' || this.style.hAlign === 'left';
        var bound, parentBound;
        if (unit === 'px') {
            if (typeof value != 'number' || disabled) {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return parentBound.right - bound.right;
            }
            else {
                return value;
            }
        }
        else if (unit === '%') {
            if (((typeof value == 'string') && (!value.match(/%$/)))
                || (typeof value != 'string') || disabled) {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return (parentBound.right - bound.right) * 100 / parentBound.width;
            }
            else {
                return parseFloat(value.replace('%', ''));
            }
        }
        else
            return value;
    },
    getDescriptor: function () {
        return {
            type: 'measurePosition',
            min: -Infinity,
            max: Infinity,
            disabled: this.style.hAlign === 'center' || this.style.hAlign === 'left',
            livePreview: true,
            dependency: ['hAlign', 'right', 'width']
        };
    }
};


RelativeAnchor.prototype.compStyleHandlers.top = {
    set: function (value) {
        var unit = arguments.length > 2 ? arguments[1] : undefined;
        var ref = arguments[arguments.length - 1];
        var currentValue = ref.get();
        var parentBound;
        if (unit === 'px') {//value must be a number
            if ((typeof currentValue === 'string') && currentValue.match(/%$/)) {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * 100 / parentBound.height + '%';
            }
        }
        else if (unit === '%') {
            if (typeof currentValue === 'number') {
                parentBound = this.parent.domElt.getBoundingClientRect()
                value = value * parentBound.height / 100 + '%';
            }
        }
        var styleValue = value >= 0 ? value + 'px' : value;
        if (this.style.vAlign !== 'center' && this.style.vAlign !== 'bottom') {
            this.anchor.domElt.addStyle('top', styleValue);
        }
        else this.anchor.domElt.removeStyle('top');
        return value;
    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        var unit = arguments.length > 1 ? arguments[0] : undefined;
        var disabled = this.style.vAlign === 'center' || this.style.vAlign === 'bottom';
        var bound, parentBound;
        if (unit === 'px') {
            if (typeof value != 'number' || disabled) {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return bound.top - parentBound.top;
            }
            else {
                return value;
            }
        }
        else if (unit === '%') {
            if (((typeof value == 'string') && (!value.match(/%$/)))
                || (typeof value != 'string') || disabled) {
                {
                    bound = this.domElt.getBoundingClientRect();
                    parentBound = this.parent.domElt.getBoundingClientRect();
                    return (bound.top - parentBound.top) * 100 / parentBound.height;
                }
            }
            else {
                return parseFloat(value.replace('%', ''));
            }
        }
        else
            return value;
    },
    getDescriptor: function () {
        return {
            type: 'measurePosition',
            min: -Infinity,
            max: Infinity,
            disabled: this.style.vAlign === 'center' || this.style.vAlign === 'bottom',
            livePreview: true,
            dependency: ['vAlign', 'bottom', 'height']
        };
    }
};


RelativeAnchor.prototype.compStyleHandlers.bottom = {
    set: function (value) {
        var unit = arguments.length > 2 ? arguments[1] : undefined;
        var ref = arguments[arguments.length - 1];
        var currentValue = ref.get();
        var parentBound;
        if (unit === 'px') {//value must be a number
            if ((typeof currentValue === 'string') && currentValue.match(/%$/)) {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * 100 / parentBound.height + '%';
            }
        }
        else if (unit === '%') {
            if (typeof currentValue === 'number') {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * parentBound.height / 100 + '%';
            }
        }
        var styleValue = value >= 0 ? value + 'px' : value;
        if (this.style.vAlign !== 'center' && this.style.vAlign !== 'top') {
            this.anchor.domElt.addStyle('bottom', styleValue);
        }
        else this.anchor.domElt.removeStyle('bottom');
        return value;
    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        var unit = arguments.length > 1 ? arguments[0] : undefined;
        var disabled = this.style.vAlign === 'center' || this.style.vAlign === 'top';
        var bound, parentBound;
        if (unit === 'px') {
            if (typeof value != 'number' || disabled) {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return parentBound.bottom - bound.bottom;
            }
            else {
                return value;
            }
        }
        else if (unit === '%') {
            if (((typeof value == 'string') && (!value.match(/%$/)))
                || (typeof value != 'string') || disabled) {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return (parentBound.bottom - bound.bottom) * 100 / parentBound.height;
            }
            else {
                return parseFloat(value.replace('%', ''));
            }
        }
        else
            return value;
    },
    getDescriptor: function () {
        return {
            type: 'measurePosition',
            min: -Infinity,
            max: Infinity,
            disabled: this.style.vAlign === 'center' || this.style.vAlign === 'top',
            livePreview: true,
            dependency: ['vAlign', 'bottom', 'height']
        };
    }
};


RelativeAnchor.prototype.compStyleHandlers.width = {
    set: function (value) {
        var ref = arguments[arguments.length - 1];
        var unit = arguments.length > 2 ? arguments[1] : undefined;
        var parentBound;
        var currentValue = ref.get();
        if (unit === 'px') {//value must be a number
            if ((typeof currentValue === 'string') && currentValue.match(/%$/)) {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * 100 / parentBound.width + '%';
            }
        }
        else if (unit === '%') {
            if (typeof this.childNode.style.width === 'number') {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * parentBound.width / 100 + '%';
            }
        }
        var styleValue = value >= 0 ? value + 'px' : value;
        if (styleValue === 'match_parent') styleValue = '100%';

        var vAlign = this.style.vAlign;
        var hAlign = this.style.hAlign;
        if (vAlign === 'center') {
            if (hAlign === 'center') {
                this.anchor.domElt.removeStyle('width');
                this.domElt.addStyle('width', styleValue);
            }
            else if (hAlign === 'fixed') {
                this.anchor.domElt.removeStyle('width');
                this.domElt.removeStyle('width');
            }
            else {
                this.anchor.domElt.addStyle('width', styleValue);
                this.domElt.removeStyle('width');
            }
        }
        else {
            if (hAlign === 'center') {
                this.domElt.addStyle('width', styleValue);
                this.anchor.domElt.removeStyle('width');
            }
            else {
                this.domElt.removeStyle('width');
                if (hAlign === 'fixed') {
                    this.anchor.domElt.removeStyle('width');
                }
                else {
                    this.anchor.domElt.addStyle('width', styleValue);
                }
            }
        }
        return value;
    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        var unit = arguments.length > 1 ? arguments[0] : undefined;
        var hAlign = this.style.hAlign;
        var disabled = this.style.hAlign === 'fixed';
        var bound, parentBound;
        if (unit === 'px') {
            if (disabled || typeof value != 'number') {
                bound = this.anchor.domElt.getBoundingClientRect();
                return bound.width
            }
            else {
                return value;
            }
        }
        else if (unit === '%') {
            if (hAlign === 'match_parent') return 100;
            else if (disabled || ((typeof value === 'string') && (!value.match(/%$/)))
                || (typeof value != 'string')) {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return bound.width * 100 / parentBound.width;
            }
            else {
                return parseFloat(value.replace('%', ''));
            }
        }
        else
            return value;
    },
    getDescriptor: function () {
        return {
            type: 'measureSize',
            disabled: this.style.hAlign === 'fixed',
            dependency: ['hAlign', 'left', 'right']
        };
    }
};


RelativeAnchor.prototype.compStyleHandlers.height = {
    set: function (value) {
        var ref = arguments[arguments.length - 1];
        var unit = arguments.length > 2 ? arguments[1] : undefined;
        var parentBound;
        var currentValue = ref.get();
        var vAlign = this.style.vAlign;
        if (unit === 'px') {//value must be a number
            if ((typeof currentValue === 'string') && currentValue.match(/%$/)) {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * 100 / parentBound.height + '%';
            }
        }
        else if (unit === '%') {
            if (typeof currentValue === 'number') {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * parentBound.height / 100 + '%';
            }
        }
        var styleValue = value >= 0 ? value + 'px' : value;
        if (styleValue === 'match_parent') styleValue = '100%';

        if (vAlign === 'center') {
            this.anchor.domElt.removeStyle('height');
            this.domElt.addStyle('height', styleValue);// set height to cell will be fail
        }
        else {
            this.domElt.removeStyle('height');
            if (vAlign === 'fixed') {
                this.anchor.domElt.removeStyle('height', styleValue);
            }
            else {
                this.anchor.domElt.addStyle('height', styleValue);
            }
        }
        return value;
    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        var unit = arguments.length > 1 ? arguments[1] : undefined;
        var disabled = this.style.vAlign === 'fixed';
        var parentBound, bound;
        var currentValue = ref.get();
        var vAlign = this.style.vAlign;
        if (unit === 'px') {
            if (disabled || typeof currentValue != 'number') {
                bound = this.domElt.getBoundingClientRect();
                return bound.height;
            }
            else {
                return currentValue;
            }
        }
        else if (unit === '%') {
            if (vAlign === 'match_parent') return 100;
            else if (disabled || ((typeof currentValue === 'string') && (!currentValue.match(/%$/)))
                || (typeof currentValue != 'string')) {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return bound.height * 100 / parentBound.height;
            }
            else {
                return parseFloat(currentValue.replace('%', ''));
            }
        }
        else
            return currentValue;
    },
    getDescriptor: function () {
        return {
            type: 'measureSize',
            disabled: this.style.vAlign === 'fixed',
            dependency: ['vAlign', 'top', 'bottom']
        }
    }
};


['hAlign', 'vAlign', 'left', 'top', 'bottom', 'width'].forEach(function (name) {
    RelativeAnchor.prototype.styleHandlers[name] = makeMapStyleHandler(name);
});


RelativeAnchor.prototype.TOP_CLASS_NAME = 'as-relative-anchor-box';

RelativeAnchor.prototype.render = function () {
    var layout = {
        class: [this.TOP_CLASS_NAME]
    };

    this.viewBinding.$containter = '.' + this.TOP_CLASS_NAME;
    return _(layout);
};


/**
 * @param {BaseComponent} child
 */
RelativeAnchor.prototype.attachChild = function (child) {
    if (this.childNode) {
        this.childNode.domElt.remove();
        this.childNode = null;
        this.childNode.anchor = null;
    }

    if (child.anchor) throw new Error("Detach anchorBox first");
    //preinit
    this.childNode = child;
    child.anchor = this;

    this.childNode.style.left = this.childNode.style.left || 0;
    this.childNode.style.right = this.childNode.style.right || 0;
    this.childNode.style.top = this.childNode.style.top || 0;
    this.childNode.style.bottom = this.childNode.style.bottom || 0;
    this.childNode.style.vAlign = this.childNode.style.vAlign || 'top';
    this.childNode.style.hAlign = this.childNode.style.hAlign || 'left';

    this.style.left = this.childNode.style.left;
    this.style.right = this.childNode.style.right;
    this.style.top = this.childNode.style.top;
    this.style.bottom = this.childNode.style.bottom;
    this.style.vAlign = this.childNode.style.vAlign;
    this.style.hAlign = this.childNode.style.hAlign;

    this.$containter.addChild(child.domElt);
    this.style.loadAttributeHandlers(this.styleHandlers);
    child.style.loadAttributeHandlers(Object.assign({}, child.styleHandlers, this.compStyleHandlers));
    child.onAnchorAttached();
};


RelativeAnchor.prototype.detachChild = function () {
    if (this.childNode) {
        this.childNode.domElt.remove();
        this.childNode.onAnchorDetached();
        this.childNode.anchor = null;
        this.childNode = null;
    }
    else
        throw new Error("Nothing to detach");
};


RelativeAnchor.prototype.HALIGN_ACCEPT_STYLE = {
    left: { left: true, right: false },
    right: { left: false, right: true },
    center: { left: false, right: false },// component need set width
    fixed: { left: true, right: true }
};

RelativeAnchor.prototype.VALIGN_ACCEPT_STYLE = {
    top: { top: true, bottom: false },
    bottom: { top: false, bottom: true },
    center: { top: false, bottom: false },// component need set height
    fixed: { top: true, bottom: true }
};

RelativeAnchor.prototype.updateVAlignStyle = function () {
    for (var key in this.VALIGN_ACCEPT_STYLE[this.childNode.style.vAlign]) {
        if (this.VALIGN_ACCEPT_STYLE[this.childNode.style.vAlign][key]) {
            this.domElt.addStyle(key, this.childNode.style[key] + 'px');
        }
        else {
            this.domElt.removeStyle(key);
        }
    }
    this.setStyle('width', this.childNode.style.width);
    this.setStyle('height', this.childNode.style.height);
};


RelativeAnchor.prototype.updateHAlignStyle = function () {
    for (var key in this.HALIGN_ACCEPT_STYLE[this.childNode.style.hAlign]) {
        if (this.HALIGN_ACCEPT_STYLE[this.childNode.style.hAlign][key]) {
            this.childNode.style[key] = key;
        }
        else {
            this.domElt.removeStyle(key);
        }
    }
    this.setStyle('width', this.childNode.style.width);
    this.setStyle('height', this.childNode.style.height);
};


Object.defineProperty(RelativeAnchor.prototype, 'view', {
    get: function () {
        return this.domElt;
    }
});


export default RelativeAnchor;