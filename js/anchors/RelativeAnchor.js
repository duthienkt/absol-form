import Fcore from "../core/FCore";
import FViewable from "../core/FViewable";
import '../../css/relativeanchor.css';
import '../../css/alignbox.css';

var _ = Fcore._;
var $ = Fcore.$;

/**
 * AnchorBox only has on child node
 */
function RelativeAnchor() {
    FViewable.call(this);
    this.childNode = null;

    //for quick binding render
    this.viewBinding = {};

    this.onCreate();
    this.view = this.render();
    this.onCreated();
}

Object.defineProperties(RelativeAnchor.prototype, Object.getOwnPropertyDescriptors(FViewable.prototype));
RelativeAnchor.prototype.construtor = RelativeAnchor;

RelativeAnchor.prototype.onCreate = function () {/* NOOP */ }

RelativeAnchor.prototype.onCreated = function () {
    for (var key in this.viewBinding) {
        this[key] = $(this.viewBinding[key], this.view);
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


RelativeAnchor.prototype.getStyleHAlignDescriptor = function () {
    return {
        type: 'enum',
        values: ['left', 'right', 'center', 'fixed'],
        disabled: false,
        sign: 'RelativeAnchor_HAlign'
    }
};

RelativeAnchor.prototype.getStyleVAlignDescriptor = function () {
    return {
        type: 'enum',
        values: ['top', 'bottom', 'center', 'fixed'],
        disabled: false,
        sign: 'RelativeAnchor_VAlign'
    };
};


RelativeAnchor.prototype.getStyleLeftDescriptor = function () {
    return {
        type: 'measurePosition',
        min: -Infinity,
        max: Infinity,
        disabled: this.childNode.style.hAlign == 'center' || this.childNode.style.hAlign == 'right',
        livePreview: true,
        dependency: ['hAlign', 'right', 'width']
    };
};


RelativeAnchor.prototype.getStyleRightDescriptor = function () {
    return {
        type: 'measurePosition',
        min: -Infinity,
        max: Infinity,
        disabled: this.childNode.style.hAlign == 'center' || this.childNode.style.hAlign == 'left',
        livePreview: true,
        dependency: ['hAlign', 'left', 'width']
    };
};


RelativeAnchor.prototype.getStyleTopDescriptor = function () {
    return {
        type: 'measurePosition',
        min: -Infinity,
        max: Infinity,
        disabled: this.childNode.style.vAlign == 'center' || this.childNode.style.vAlign == 'bottom',
        livePreview: true,
        dependency: ['vAlign', 'bottom', 'height']
    };
};


RelativeAnchor.prototype.getStyleBottomDescriptor = function () {
    return {
        type: 'measurePosition',
        min: -Infinity,
        max: Infinity,
        disabled: this.childNode.style.vAlign == 'center' || this.childNode.style.vAlign == 'top',
        livePreview: true,
        dependency: ['vAlign', 'top', 'height']
    };
};



RelativeAnchor.prototype.setStyleHAlign = function (value) {
    if (this.style.hAlign == value) return value;
    if (!this.HALIGN_VALUE.includes(value)) value = this.HALIGN_VALUE[0];
    this.view.removeClass(this.HALIGN_CLASS_NAMES[this.style.hAlign]);
    this.childNode.style.hAlign = value;
    this.style.hAlign = value;//really sync
    this.view.addClass(this.HALIGN_CLASS_NAMES[this.childNode.style.hAlign]);
    this.updateHAlignStyle();
    return value;
};



RelativeAnchor.prototype.setStyleVAlign = function (value) {
    if (this.style.vAlign == value) return value;
    if (!this.VALIGN_VALUE.includes(value)) value = this.VALIGN_VALUE[0];

    this.view.removeClass(this.VALIGN_CLASS_NAMES[this.childNode.style.vAlign]);
    if (this.style.vAlign == 'center') {
        this.view.clearChild();
        this.viewBinding.$containter = '.' + this.TOP_CLASS_NAME;
        this.$containter = this.view;

        if (this.childNode) {
            this.$containter.addChild(this.childNode.view);
        }
    }

    this.childNode.style.vAlign = value;
    this.style.vAlign = value;
    this.view.addClass(this.VALIGN_CLASS_NAMES[this.childNode.style.vAlign]);
    if (this.childNode.style.vAlign == 'center') {
        this.view.clearChild();
        this.view.addChild(_({
            class: 'as-align-box',
            child: '.as-align-box-cell'
        }
        ));
        this.viewBinding.$containter = '.as-align-box-cell';
        this.$containter = $(this.viewBinding.$containter, this.view);
        if (this.childNode) {
            this.$containter.addChild(this.childNode.view);
        }
    }
    this.updateVAlignStyle();
    return value;
};


RelativeAnchor.prototype.setStyleLeft = function (value, unit) {
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
    if (this.childNode.style.hAlign != 'center' && this.childNode.style.hAlign != 'right') {
        this.view.addStyle('left', styleValue);
    }
    else this.view.removeStyle('left');
    return value;
};


RelativeAnchor.prototype.getStyleLeft = function (unit) {
    if (unit == 'px') {
        if (this.childNode.style.hAlign == 'center'
            || this.childNode.style.hAlign == 'right'
            || this.childNode.style.left === undefined
            || this.childNode.style.left === null
            || (typeof this.childNode.style.left != 'number')) {
            return this.childNode.view.getBoundingClientRect().left - this.childNode.parent.view.getBoundingClientRect().left;
        }
        else {
            return this.childNode.style.left;
        }
    }
    else if (unit == '%') {
        if (this.childNode.style.hAlign == 'center'
            || this.childNode.style.hAlign == 'right'
            || this.childNode.style.left === undefined
            || this.childNode.style.left === null
            || (typeof this.childNode.style.left != 'string')
            || (typeof this.childNode.style.left == 'string' && this.childNode.style.left.match(/\%$/))) {
            var parentBound = this.childNode.parent.view.getBoundingClientRect();
            var nodeBound = this.childNode.view.getBoundingClientRect();
            return (nodeBound.left - parentBound.left) * 100 / parentBound.width;
        }
        else {
            return parseFloat(this.childNode.style.left.replace('%', ''));
        }
    }
    else
        return this.childNode.style.left;
};




RelativeAnchor.prototype.setStyleRight = function (value, unit) {
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
    if (this.childNode.style.hAlign != 'center' && this.childNode.style.hAlign != 'left') {
        this.view.addStyle('right', styleValue);
    }
    else this.view.removeStyle('right');

    return value;
};


RelativeAnchor.prototype.getStyleRight = function (unit) {
    if (unit == 'px') {
        if (this.childNode.style.hAlign == 'center'
            || this.childNode.style.hAlign == 'left'
            || this.childNode.style.right === undefined
            || this.childNode.style.right === null
            || (typeof this.childNode.style.right != 'number')) {
            return this.childNode.parent.view.getBoundingClientRect().right - this.childNode.view.getBoundingClientRect().right;
        }
        else {
            return this.childNode.style.right;
        }
    }
    else if (unit == '%') {
        if (this.childNode.style.hAlign == 'center'
            || this.childNode.style.hAlign == 'left'
            || this.childNode.style.right === undefined
            || this.childNode.style.right === null
            || (typeof this.childNode.style.right != 'string')
            || (typeof this.childNode.style.right == 'string' && !this.childNode.style.right.match(/\%$/))) {
            var parentBound = this.childNode.parent.view.getBoundingClientRect();
            var nodeBound = this.childNode.view.getBoundingClientRect();
            return (parentBound.right - nodeBound.right) * 100 / parentBound.width;
        }
        else {
            return parseFloat(this.childNode.style.right.replace('%', ''));
        }
    }
    else
        return this.childNode.style.right;
};

RelativeAnchor.prototype.setStyleTop = function (value, unit) {
    if (unit == 'px') {//value must be a number
        if ((typeof this.childNode.style.top == 'string') && this.childNode.style.top.match(/\%$/)) {
            value = value * 100 / this.childNode.parent.view.getBoundingClientRect().height + '%';
        }
    }
    else if (unit == '%') {
        if (typeof this.childNode.style.top == 'number') {
            value = value * this.childNode.parent.view.getBoundingClientRect().height / 100 + '%';
        }
    }
    var styleValue = value >= 0 ? value + 'px' : value;
    if (this.childNode.style.vAlign != 'center' && this.childNode.style.vAlign != 'bottom') {
        this.view.addStyle('top', styleValue);
    }
    else this.view.removeStyle('top');
    return value;
};



RelativeAnchor.prototype.getStyleTop = function (unit) {
    if (unit == 'px') {
        if (this.childNode.style.vAlign == 'center'
            || this.childNode.style.vAlign == 'bottom'
            || this.childNode.style.top === undefined
            || this.childNode.style.top === null
            || (typeof this.childNode.style.top != 'number')) {
            return this.childNode.view.getBoundingClientRect().top - this.childNode.parent.view.getBoundingClientRect().top;
        }
        else {
            return this.childNode.style.top;
        }
    }
    else if (unit == '%') {
        if (this.childNode.style.vAlign == 'center'
            || this.childNode.style.vAlign == 'bottom'
            || this.childNode.style.top === undefined
            || this.childNode.style.top === null
            || (typeof this.childNode.style.top != 'string')
            || (typeof this.childNode.style.top == 'string' && this.childNode.style.top.match(/\%$/))) {
            var parentBound = this.childNode.parent.view.getBoundingClientRect();
            var nodeBound = this.childNode.view.getBoundingClientRect();
            return (nodeBound.top - parentBound.top) * 100 / parentBound.height;
        }
        else {
            return parseFloat(this.childNode.style.top.replace('%', ''));
        }
    }
    else
        return this.childNode.style.top;
};



RelativeAnchor.prototype.setStyleBottom = function (value, unit) {
    if (unit == 'px') {//value must be a number
        if ((typeof this.childNode.style.bottom == 'string') && this.childNode.style.bottom.match(/\%$/)) {
            value = value * 100 / this.childNode.parent.view.getBoundingClientRect().height + '%';
        }
    }
    else if (unit == '%') {
        if (typeof this.childNode.style.bottom == 'number') {
            value = value * this.childNode.parent.view.getBoundingClientRect().height / 100 + '%';
        }
    }
    var styleValue = value >= 0 ? value + 'px' : value;
    if (this.childNode.style.vAlign != 'center' && this.childNode.style.vAlign != 'top') {
        this.view.addStyle('bottom', styleValue);
    }
    else this.view.removeStyle('bottom');

    return value;
};


RelativeAnchor.prototype.getStyleBottom = function (unit) {

    if (unit == 'px') {
        if (this.childNode.style.vAlign == 'center'
            || this.childNode.style.vAlign == 'top'
            || this.childNode.style.bottom === undefined
            || this.childNode.style.bottom === null
            || (typeof this.childNode.style.bottom != 'number')) {
            return this.childNode.parent.view.getBoundingClientRect().bottom - this.childNode.view.getBoundingClientRect().bottom;
        }
        else {
            return this.childNode.style.bottom;
        }
    }
    else if (unit == '%') {
        if (this.childNode.style.vAlign == 'center'
            || this.childNode.style.vAlign == 'top'
            || this.childNode.style.bottom === undefined
            || this.childNode.style.bottom === null
            || (typeof this.childNode.style.bottom != 'string')
            || (typeof this.childNode.style.bottom == 'string' && this.childNode.style.bottom.match(/\%$/))) {
            var parentBound = this.childNode.parent.view.getBoundingClientRect();
            var nodeBound = this.childNode.view.getBoundingClientRect();
            return (parentBound.bottom - nodeBound.bottom) * 100 / parentBound.height;
        }
        else {
            return parseFloat(this.childNode.style.bottom.replace('%', ''));
        }
    }
    else
        return this.childNode.style.bottom;
};


RelativeAnchor.prototype.getStyleWidth = function (unit) {
    if (unit == 'px') {
        if (this.childNode.style.hAlign == 'fixed' || this.childNode.style.hAlign == 'auto' || typeof this.childNode.style.width != 'number')
            return this.view.getBoundingClientRect().width;
        else {
            return this.childNode.style.width;
        }
    }
    else if (unit == '%') {
        if (this.childNode.style.hAlign == 'match_parent') return 100;
        else if (this.childNode.style.hAlign == 'fixed' || this.childNode.style.hAlign == 'auto' || ((typeof this.childNode.style.width == 'string') && (!this.childNode.style.width.match(/\%$/))) || (typeof this.childNode.style.width != 'string')) {
            return this.childNode.view.getBoundingClientRect().width * 100 / this.childNode.parent.view.getBoundingClientRect().width;
        }
        else {
            return parseFloat(this.childNode.style.width.replace('%', ''));
        }
    } else
        return this.childNode.style.width;
};



RelativeAnchor.prototype.getStyleHeight = function (unit) {
    if (unit == 'px') {
        if (this.style.vAlign == 'fixed' || this.style.vAlign == 'auto' || typeof this.style.height != 'number')
            return this.view.getBoundingClientRect().height;
        else {
            return this.style.height;
        }
    }
    else if (unit == '%') {
        if (this.style.vAlign == 'match_parent') return 100;
        else if (this.style.vAlign == 'fixed' || this.style.vAlign == 'auto' || ((typeof this.style.height == 'string') && (!this.style.height.match(/\%$/))) || (typeof this.style.height != 'string')) {
            return this.childNode.view.getBoundingClientRect().height * 100 / this.childNode.parent.view.getBoundingClientRect().height;
        }
        else {
            return parseFloat(this.style.height.replace('%', ''));
        }
    } else
        return this.style.height;
};


RelativeAnchor.prototype.setStyleWidth = function (value, unit) {
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
   

    if (this.childNode.style.vAlign == 'center') {
        if (this.childNode.style.hAlign == 'center') {
            this.view.removeStyle('width');
            this.childNode.view.addStyle('width', styleValue);
        }
        else if (this.childNode.style.hAlign == 'fixed') {
            this.view.removeStyle('width');
            this.childNode.view.removeStyle('width');
        }
        else {
            this.view.addStyle('width', styleValue);
            this.childNode.view.removeStyle('width');
        }
    }
    else {
        if (this.childNode.style.hAlign == 'center') {
            this.childNode.view.addStyle('width', styleValue);
            this.view.removeStyle('width');
        }
        else {
            this.childNode.view.removeStyle('width');
            if (this.childNode.style.hAlign == 'fixed') {
                this.view.removeStyle('width', styleValue);
            }
            else {
                this.view.addStyle('width', styleValue);
            }
        }
    }
    return value;
};


RelativeAnchor.prototype.setStyleHeight = function (value, unit) {
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
   

    if (this.childNode.style.vAlign == 'center') {
        this.view.removeStyle('height');
        this.childNode.view.addStyle('height', styleValue);// set height to cell will be fail
    }
    else {
        this.childNode.view.removeStyle('height');
        if (this.childNode.style.vAlign == 'fixed') {
            this.view.removeStyle('height', styleValue);
        }
        else {
            this.view.addStyle('height', styleValue);
        }
    }
    return value;
};



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
        this.childNode.view.remove();
        this.childNode = null;
        this.childNode.anchor = null;
    }

    if (child.anchor) throw new Error("Detach anchorBox first");
    //preinit
    this.childNode = child;
    this.childNode.style.left = this.childNode.style.left || 0;
    this.childNode.style.right = this.childNode.style.right || 0;
    this.childNode.style.top = this.childNode.style.top || 0;
    this.childNode.style.bottom = this.childNode.style.bottom || 0;
    this.childNode.style.vAlign = this.childNode.style.vAlign || 'top';
    this.childNode.style.hAlign = this.childNode.style.hAlign || 'left';
    child.anchor = this;
    this.$containter.addChild(child.view);
    this.setStyleVAlign(this.childNode.style.vAlign);
    this.setStyleHAlign(this.childNode.style.hAlign);
    child.onAnchorAttached();
};


RelativeAnchor.prototype.detachChild = function () {
    if (this.childNode) {
        this.childNode.view.remove();
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
            this.view.addStyle(key, this.childNode.style[key] + 'px');
        }
        else {
            this.view.removeStyle(key);
        }
    }
    this.setStyle('width', this.childNode.style.width);
    this.setStyle('height', this.childNode.style.height);
};


RelativeAnchor.prototype.updateHAlignStyle = function () {
    for (var key in this.HALIGN_ACCEPT_STYLE[this.childNode.style.hAlign]) {
        if (this.HALIGN_ACCEPT_STYLE[this.childNode.style.hAlign][key]) {
            this.view.addStyle(key, this.childNode.style[key] + 'px');
        }
        else {
            this.view.removeStyle(key);
        }
    }
    this.setStyle('width', this.childNode.style.width);
    this.setStyle('height', this.childNode.style.height);
};




RelativeAnchor.prototype.getStyleWidthDescriptor = function () {
    return {
        type: 'measureSize',
        disabled: this.style.hAlign == 'fixed',
        dependency: ['hAlign', 'left', 'right']
    };
};

RelativeAnchor.prototype.getStyleHeightDescriptor = function () {
    return {
        type: 'measureSize',
        disabled: this.style.vAlign == 'fixed',
        dependency: ['vAlign', 'top', 'bottom']
    };
};

export default RelativeAnchor;