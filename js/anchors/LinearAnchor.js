import Fcore from "../core/FCore";
import FViewable from "../core/FViewable";
import '../../css/linearanchor.css';
import {inheritComponentClass} from "../core/BaseComponent";
import makeMapStyleHandler from "./makeMapStyleHandler";

var _ = Fcore._;
var $ = Fcore.$;

/**
 * AnchorBox only has one child node
 * @extends FViewable
 */
function LinearAnchor() {
    FViewable.call(this);
    this.style.left = 0;
    this.style.right = 0;
    this.style.top = 0;
    this.style.bottom = 0;
    this.width = 0;
    this.height = 0;
    this.childNode = null;

    //for quick binding render
    this.viewBinding = {};

    this.onCreate();
    this.domElt = this.render();
    this.onCreated();
}

inheritComponentClass(LinearAnchor, FViewable);

LinearAnchor.prototype.TOP_CLASS_NAME = 'as-linear-anchor-box';


LinearAnchor.prototype.onCreate = function () {/* NOOP */
}

LinearAnchor.prototype.onCreated = function () {
    for (var key in this.viewBinding) {
        this[key] = $(this.viewBinding[key], this.view);
    }
};


LinearAnchor.prototype.getAcceptsStyleNames = function () {
    return ['left', 'right', 'top', 'bottom'];
};

['left', 'top', 'bottom', 'width'].forEach(function (name) {
    LinearAnchor.prototype.styleHandlers[name] = makeMapStyleHandler(name);
});

LinearAnchor.prototype.compStyleHandlers = {};

LinearAnchor.prototype.compStyleHandlers.height = {
    set: function (value) {
        var ref = arguments[arguments.length - 1];
        var currentValue = ref.get();
        var unit = arguments[1];
        var parentBound;
        if (unit === 'px') {//value must be a number
            if ((typeof currentValue == 'string') && currentValue.match(/%$/)) {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * 100 / parentBound.height + '%';
            }
        }
        else if (unit === '%') {
            if (typeof this.childNode.style.height == 'number') {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * parentBound.height / 100 + '%';
            }
        }

        var styleValue = value >= 0 ? value + 'px' : value;
        if (styleValue === 'match_parent') styleValue = '100%';
        this.anchor.domElt.addStyle('height', styleValue);
        this.domElt.removeStyle('height');
        return value;

    },
    get: function () {
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        var unit = arguments.length[1] ? arguments[0] : undefined;
        var bound, parentBound;
        if (unit === 'px') {
            if (value !== 'number') {
                bound = this.domElt.getBoundingClientRect();
                return bound.height;
            }
            else {
                return value;
            }
        }
        else if (unit === '%') {
            if (typeof value === 'string' && value.match(/%$/))
                return parseFloat(value.replace('%', ''));
            else {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return bound.height * 100 / parentBound.height;
            }
        }
        else
            return value;
    },
    descriptor: {
        type: 'measureSize',
        sign: 'LinearHeight',
        independence: true
    }
};

LinearAnchor.prototype.compStyleHandlers.width = {
    set: function (value) {
        var ref = arguments[arguments.length - 1];
        var unit = arguments.length > 2 ? arguments[1] : undefined;
        var currentValue = ref.get();
        var parentBound;
        if (unit === 'px') {//value must be a number
            if ((typeof currentValue == 'string') && currentValue.match(/%$/)) {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * 100 / parentBound.width + '%';
            }
        }
        else if (unit === '%') {
            if (typeof this.childNode.style.width == 'number') {
                parentBound = this.parent.domElt.getBoundingClientRect();
                value = value * parentBound.width / 100 + '%';
            }
        }
        var styleValue = value >= 0 ? value + 'px' : value;
        if (styleValue === 'match_parent') styleValue = '100%';
        this.anchor.domElt.addStyle('width', styleValue);
        this.domElt.removeStyle('width');
        return value;
    },
    get: function () {
        var unit = arguments.length > 1 ? arguments[0] : undefined;
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        var bound, parentBound;
        if (unit === 'px') {
            if (value !== 'number') {
                bound = this.domElt.getBoundingClientRect();
                return bound.width;
            }
            else {
                return value;
            }
        }
        else if (unit === '%') {
            if (typeof value === 'string' && value.match(/%$/))
                return parseFloat(value.replace('%', ''));
            else {
                bound = this.domElt.getBoundingClientRect();
                parentBound = this.parent.domElt.getBoundingClientRect();
                return bound.width * 100 / parentBound.width;
            }
        }
        else
            return value;
    },
    descriptor: {
        type: 'measureSize',
        sign: 'LinearWidth',
        independence: true
    }
};

['left', 'right', 'top', 'bottom'].forEach(function (name) {
    LinearAnchor.prototype.compStyleHandlers[name] = {
        set: function (value) {
            var ref = arguments[arguments.length - 1];
            var unit = arguments.length > 2 ? arguments[1] : undefined;
            var currentValue = ref.get();
            var parentBound;
            if (unit === 'px') {//value must be a number
                if ((typeof currentValue == 'string') && currentValue.match(/%$/)) {
                    parentBound = this.parent.domElt.getBoundingClientRect();
                    value = value * 100 / parentBound.width + '%';
                }
            }
            else if (unit === '%') {
                if (typeof currentValue == 'number') {
                    parentBound = this.parent.domElt.getBoundingClientRect();
                    value = value * parentBound.width / 100;
                }
            }
            var styleValue = value >= 0 ? value + 'px' : value;
            this.anchor.domElt.addStyle('margin-' + name, styleValue);
            return value;
        },
        get: function () {
            var unit = arguments.length > 1 ? arguments[0] : undefined;
            var ref = arguments[arguments.length - 1];
            var value = ref.get();
            var parentBound;
            if (unit === 'px') {
                if (value === undefined
                    || value === null
                    || (typeof value != 'number')) {
                    return parseFloat(this.anchor.domElt.getComputedStyleValue('margin-' + name).replace('px', ''));
                }
                else {
                    return value;
                }
            }
            else if (unit === '%') {
                if (value === undefined
                    || value === null
                    || (typeof value != 'string')
                    || (!value.match(/%$/))) {
                    parentBound = this.parent.domElt.getBoundingClientRect();
                    var marginVal = parseFloat(this.anchor.domElt.getComputedStyleValue('margin-left').replace('px', ''));
                    return marginVal * 100 / parentBound.width;
                }
                else {
                    return parseFloat(value.replace('%', ''));
                }
            }
            else
                return value;
        },
        export: function (ref) {
            var value = ref.get();
            if (value === 0 || value === '0%') return value;
            return undefined;
        },
        descriptor: {
            type: 'measurePosition',
            min: -Infinity,
            max: Infinity,
            dependency: ['width'],
            sign: 'Linear' + name.substr(0, 1).toUpperCase() + name.substr(1),
            independence: true
        }
    };
});


LinearAnchor.prototype.render = function () {
    var layout = {
        class: [this.TOP_CLASS_NAME]
    };
    return _(layout);
};


/**
 * @param {BaseComponent} child
 */
LinearAnchor.prototype.attachChild = function (child) {
    if (this.childNode) {
        this.childNode.view.remove();
        this.childNode = null;
        this.childNode.anchor = null;
    }

    if (child.anchor) throw new Error("Detach anchorBox first");
    this.childNode = child;
    child.anchor = this;
    this.childNode.style.width = this.childNode.style.width || 0;
    this.childNode.style.height = this.childNode.style.height || 0;
    this.childNode.style.left = this.childNode.style.left || 0;
    this.childNode.style.right = this.childNode.style.right || 0;
    this.childNode.style.top = this.childNode.style.top || 0;
    this.childNode.style.bottom = this.childNode.style.bottom || 0;
    this.style.left = this.childNode.style.left;
    this.style.right = this.childNode.style.right;
    this.style.top = this.childNode.style.top;
    this.style.bottom = this.childNode.style.bottom;

    this.domElt.addChild(child.view);
    this.style.loadAttributeHandlers(this.styleHandlers);
    child.style.loadAttributeHandlers(Object.assign({}, child.styleHandlers, this.compStyleHandlers));
    child.onAnchorAttached();
};

LinearAnchor.prototype.detachChild = function () {
    if (this.childNode) {
        this.childNode.view.remove();
        this.childNode.onAnchorDetached();
        this.childNode.anchor = null;
        this.childNode = null;
    }
    else
        throw new Error("Nothing to detach");
};


Object.defineProperty(LinearAnchor.prototype, 'view', {
    get: function () {
        return this.domElt;
    }
});


export default LinearAnchor;