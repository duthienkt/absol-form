import Fcore from "../core/FCore";
import FViewable from "../core/FViewable";
import '../../css/linearanchor.css';

var _ = Fcore._;
var $ = Fcore.$;

/**
 * AnchorBox only has on child node
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
    this.view = this.render();
    this.onCreated();
}

Object.defineProperties(LinearAnchor.prototype, Object.getOwnPropertyDescriptors(FViewable.prototype));
LinearAnchor.prototype.construtor = LinearAnchor;

LinearAnchor.prototype.TOP_CLASS_NAME = 'as-linear-anchor-box';


LinearAnchor.prototype.onCreate = function () {/* NOOP */ }

LinearAnchor.prototype.onCreated = function () {
    for (var key in this.viewBinding) {
        this[key] = $(this.viewBinding[key], this.view);
    }
};



LinearAnchor.prototype.getAcceptsStyleNames = function () {
    return ['left', 'right', 'top', 'bottom'];
};


LinearAnchor.prototype.getStyleLeftDescriptor = function () {
    return {
        type: 'measurePosition',
        min: -Infinity,
        max: Infinity,
        dependency: ['width']
    };
};


LinearAnchor.prototype.getStyleRightDescriptor = function () {
    return {
        type: 'measurePosition',
        min: -Infinity,
        max: Infinity,
        dependency: ['width']
    };
};


LinearAnchor.prototype.getStyleTopDescriptor = function () {
    return {
        type: 'measurePosition',
        min: -Infinity,
        max: Infinity,
        dependency: ['height']
    };
};


LinearAnchor.prototype.getStyleBottomDescriptor = function () {
    return {
        type: 'measurePosition',
        min: -Infinity,
        max: Infinity,
        dependency: ['height']
    };
};


LinearAnchor.prototype.setStyleLeft = function (value, unit) {
    if (unit == 'px') {//value must be a number
        if ((typeof this.childNode.style.left == 'string') && this.childNode.style.left.match(/\%$/)) {
            value = value * 100 / this.childNode.parent.view.getBoundingClientRect().width + '%';
        }
    }
    else if (unit == '%') {
        if (typeof this.childNode.style.left == 'number') {
            value = value * this.childNode.parent.view.getBoundingClientRect().width / 100 + '%';
        }
    }
    var styleValue = value >= 0 ? value + 'px' : value;
    this.view.addStyle('margin-left', styleValue);
    return value;
};


LinearAnchor.prototype.getStyleLeft = function (unit) {
    if (unit == 'px') {
        if (this.childNode.style.left === undefined
            || this.childNode.style.left === null
            || (typeof this.childNode.style.left != 'number')) {
            return parseFloat(this.view.getComputedStyleValue('margin-left').replace('px', ''));
        }
        else {
            return this.childNode.style.left;
        }
    }
    else if (unit == '%') {
        if (this.childNode.style.left === undefined
            || this.childNode.style.left === null
            || (typeof this.childNode.style.left != 'string')
            || (typeof this.childNode.style.left == 'string' && !this.childNode.style.left.match(/\%$/))) {
            var parentBound = this.childNode.parent.view.getBoundingClientRect();
            var nodeLeft = parseFloat(this.view.getComputedStyleValue('margin-left').replace('px', ''));
            return nodeLeft * 100 / parentBound.width;
        }
        else {
            return parseFloat(this.childNode.style.left.replace('%', ''));
        }
    }
    else
        return this.childNode.style.left;
};



LinearAnchor.prototype.setStyleRight = function (value, unit) {
    if (unit == 'px') {//value must be a number
        if ((typeof this.childNode.style.right == 'string') && this.childNode.style.right.match(/\%$/)) {
            value = value * 100 / this.childNode.parent.view.getBoundingClientRect().width + '%';
        }
    }
    else if (unit == '%') {
        if (typeof this.childNode.style.right == 'number') {
            value = value * this.childNode.parent.view.getBoundingClientRect().width / 100 + '%';
        }
    }
    var styleValue = value >= 0 ? value + 'px' : value;
    this.view.addStyle('margin-right', styleValue);
    return value;
};


LinearAnchor.prototype.getStyleRight = function (unit) {
    if (unit == 'px') {
        if (this.childNode.style.right === undefined
            || this.childNode.style.right === null
            || (typeof this.childNode.style.right != 'number')) {
            return parseFloat(this.view.getComputedStyleValue('margin-right').replace('px', ''));
        }
        else {
            return this.childNode.style.right;
        }
    }
    else if (unit == '%') {
        if (this.childNode.style.right === undefined
            || this.childNode.style.right === null
            || (typeof this.childNode.style.right != 'string')
            || (typeof this.childNode.style.right == 'string' && !this.childNode.style.right.match(/\%$/))) {
            var parentBound = this.childNode.parent.view.getBoundingClientRect();
            var nodeRight = parseFloat(this.view.getComputedStyleValue('margin-right').replace('px', ''));
            return nodeRight * 100 / parentBound.width;
        }
        else {
            return parseFloat(this.childNode.style.right.replace('%', ''));
        }
    }
    else
        return this.childNode.style.right;
};


LinearAnchor.prototype.setStyleTop = function (value, unit) {
    if (unit == 'px') {//value must be a number
        if ((typeof this.childNode.style.top == 'string') && this.childNode.style.top.match(/\%$/)) {
            value = value * 100 / this.childNode.parent.view.getBoundingClientRect().width + '%';
        }
    }
    else if (unit == '%') {
        if (typeof this.childNode.style.top == 'number') {
            value = value * this.childNode.parent.view.getBoundingClientRect().width / 100 + '%';
        }
    }
    var styleValue = value >= 0 ? value + 'px' : value;
    this.view.addStyle('margin-top', styleValue);
    return value;
};


LinearAnchor.prototype.getStyleTop = function (unit) {
    if (unit == 'px') {
        if (this.childNode.style.top === undefined
            || this.childNode.style.top === null
            || (typeof this.childNode.style.top != 'number')) {
            return parseFloat(this.view.getComputedStyleValue('margin-top').replace('px', ''));
        }
        else {
            return this.childNode.style.top;
        }
    }
    else if (unit == '%') {
        if (this.childNode.style.top === undefined
            || this.childNode.style.top === null
            || (typeof this.childNode.style.top != 'string')
            || (typeof this.childNode.style.top == 'string' && !this.childNode.style.top.match(/\%$/))) {
            var parentBound = this.childNode.parent.view.getBoundingClientRect();
            var nodeTop = parseFloat(this.view.getComputedStyleValue('margin-top').replace('px', ''));
            return nodeTop * 100 / parentBound.width;
        }
        else {
            return parseFloat(this.childNode.style.top.replace('%', ''));
        }
    }
    else
        return this.childNode.style.top;
};


LinearAnchor.prototype.setStyleBottom = function (value, unit) {
    if (unit == 'px') {//value must be a number
        if ((typeof this.childNode.style.bottom == 'string') && this.childNode.style.bottom.match(/\%$/)) {
            value = value * 100 / this.childNode.parent.view.getBoundingClientRect().width + '%';
        }
    }
    else if (unit == '%') {
        if (typeof this.childNode.style.bottom == 'number') {
            value = value * this.childNode.parent.view.getBoundingClientRect().width / 100 + '%';
        }
    }
    var styleValue = value >= 0 ? value + 'px' : value;

    this.view.addStyle('margin-bottom', styleValue);
    return value;
};


LinearAnchor.prototype.getStyleBottom = function (unit) {
    if (unit == 'px') {
        if (this.childNode.style.bottom === undefined
            || this.childNode.style.bottom === null
            || (typeof this.childNode.style.bottom != 'number')) {
            return parseFloat(this.view.getComputedStyleValue('margin-bottom').replace('px', ''));
        }
        else {
            return this.childNode.style.bottom;
        }
    }
    else if (unit == '%') {
        if (this.childNode.style.bottom === undefined
            || this.childNode.style.bottom === null
            || (typeof this.childNode.style.bottom != 'string')
            || (typeof this.childNode.style.bottom == 'string' && !this.childNode.style.bottom.match(/\%$/))) {
            var parentBound = this.childNode.parent.view.getBoundingClientRect();
            var nodeBottom = parseFloat(this.view.getComputedStyleValue('margin-bottom').replace('px', ''));
            return nodeBottom * 100 / parentBound.width;
        }
        else {
            return parseFloat(this.childNode.style.bottom.replace('%', ''));
        }
    }
    else
        return this.childNode.style.bottom;
};


LinearAnchor.prototype.setStyleWidth = function (value, unit) {
    if (unit == 'px') {//value must be a number
        if ((typeof this.childNode.style.width == 'string') && this.childNode.style.width.match(/\%$/)) {
            value = value * 100 / this.childNode.parent.view.getBoundingClientRect().width + '%';
        }
    }
    else if (unit == '%') {
        if (typeof this.childNode.style.width == 'number') {
            value = value * this.childNode.parent.view.getBoundingClientRect().width / 100 + '%';
        }
    }
    var styleValue = value >= 0 ? value + 'px' : value;
    if (styleValue == 'match_parent') styleValue = '100%';
    else if (styleValue == 'wrap_content') styleValue = 'auto';

    this.view.addStyle('width', styleValue);
    this.childNode.view.removeStyle('width');
    return value;
};


LinearAnchor.prototype.setStyleHeight = function (value, unit) {
    if (unit == 'px') {//value must be a number
        if ((typeof this.childNode.style.height == 'string') && this.childNode.style.height.match(/\%$/)) {
            value = value * 100 / this.childNode.parent.view.getBoundingClientRect().height + '%';
        }
    }
    else if (unit == '%') {
        if (typeof this.childNode.style.height == 'number') {
            value = value * this.childNode.parent.view.getBoundingClientRect().height / 100 + '%';
        }
    }
    var styleValue = value >= 0 ? value + 'px' : value;
    if (styleValue == 'match_parent') styleValue = '100%';
    else if (styleValue == 'wrap_content') styleValue = 'auto';
    this.view.addStyle('height', styleValue);
    this.childNode.view.removeStyle('height');
    return value;
};



LinearAnchor.prototype.getStyleWidth = function (unit) {
    if (unit == 'px') {
        if (this.childNode.style.hAlign == 'fixed' || this.childNode.style.hAlign == 'wrap_content' || typeof this.childNode.style.width != 'number')
            return this.view.getBoundingClientRect().width;
        else {
            return this.childNode.style.width;
        }
    }
    else if (unit == '%') {
        if (this.childNode.style.hAlign == 'match_parent') return 100;
        else if (this.childNode.style.hAlign == 'fixed' || this.childNode.style.hAlign == 'wrap_content' || ((typeof this.childNode.style.width == 'string') && (!this.childNode.style.width.match(/\%$/))) || (typeof this.childNode.style.width != 'string')) {
            return this.childNode.view.getBoundingClientRect().width * 100 / this.childNode.parent.view.getBoundingClientRect().width;
        }
        else {
            return parseFloat(this.childNode.style.width.replace('%', ''));
        }
    } else
        return this.childNode.style.width;
};



LinearAnchor.prototype.getStyleHeight = function (unit) {
    if (unit == 'px') {
        if (this.style.vAlign == 'wrap_content' || typeof this.style.height != 'number')
            return this.view.getBoundingClientRect().height;
        else {
            return this.style.height;
        }
    }
    else if (unit == '%') {
        if (this.style.vAlign == 'match_parent') return 100;
        else if (this.style.vAlign == 'wrap_content' || ((typeof this.style.height == 'string') && (!this.style.height.match(/\%$/))) || (typeof this.style.height != 'string')) {
            return this.childNode.view.getBoundingClientRect().height * 100 / this.childNode.parent.view.getBoundingClientRect().height;
        }
        else {
            return parseFloat(this.style.height.replace('%', ''));
        }
    } else
        return this.style.height;
};



LinearAnchor.prototype.getStyleWidthDescriptor = function () {
    return {
        type: 'measureSize'
    };
};

LinearAnchor.prototype.getStyleHeightDescriptor = function () {
    return {
        type: 'measureSize'
    };
};


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
    this.childNode.style.width = this.childNode.style.width || 0;
    this.childNode.style.height = this.childNode.style.height || 0;
    this.childNode.style.left = this.childNode.style.left || 0;
    this.childNode.style.right = this.childNode.style.right || 0;
    this.childNode.style.top = this.childNode.style.top || 0;
    this.childNode.style.bottom = this.childNode.style.bottom || 0;
    child.anchor = this;
    this.view.addChild(child.view);
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


export default LinearAnchor;