import Fcore from "../core/FCore";
import FViewable from "../core/FViewable";

var _ = Fcore._;
var $ = Fcore.$;

/**
 * AnchorBox only has on child node
 */
function RelativeAnchor() {
    FViewable.call(this);
    this.style.hAlign = this.HALIGN_VALUE[0];
    this.style.vAlign = this.VALIGN_VALUE[0];
    this.style.left = 0;
    this.style.right = 0;
    this.style.top = 0;
    this.style.bottom = 0;
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
        sign:'RelativeAnchor_HAlign'
    }
};

RelativeAnchor.prototype.getStyleVAlignDescriptor = function () {
    return {
        type: 'enum',
        values: ['top', 'bottom', 'center', 'fixed'],
        disabled: false,
        sign:'RelativeAnchor_VAlign'
    };
};


RelativeAnchor.prototype.getStyleLeftDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.style.hAlign == 'center' || this.style.hAlign == 'right',
        livePreview: true
    };
};


RelativeAnchor.prototype.getStyleRightDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.style.hAlign == 'center' || this.style.hAlign == 'left',
        livePreview: true
    };
};


RelativeAnchor.prototype.getStyleTopDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.style.vAlign == 'center' || this.style.vAlign == 'bottom',
        livePreview: true
    };
};


RelativeAnchor.prototype.getStyleBottomDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.style.vAlign == 'center' || this.style.vAlign == 'top',
        livePreview: true
    };
};



RelativeAnchor.prototype.setStyleHAlign = function (value) {
    if (this.style.hAlign == value) return value;
    if (!this.HALIGN_VALUE.includes(value)) value = this.HALIGN_VALUE[0];
    this.view.removeClass(this.HALIGN_CLASS_NAMES[this.style.hAlign]);
    this.style.hAlign = value;
    this.view.addClass(this.HALIGN_CLASS_NAMES[this.style.hAlign]);
    this.updateHAlignStyle();
    return value;
};



RelativeAnchor.prototype.setStyleVAlign = function (value) {
    if (this.style.vAlign == value) return value;
    if (!this.VALIGN_VALUE.includes(value)) value = this.VALIGN_VALUE[0];

    this.view.removeClass(this.VALIGN_CLASS_NAMES[this.style.vAlign]);
    if (this.style.vAlign == 'center') {
        this.view.clearChild();
        this.viewBinding.$containter = '.' + this.TOP_CLASS_NAME;
        this.$containter = this.view;

        if (this.childNode) {
            this.$containter.addChild(this.childNode.view);
        }
    }

    this.style.vAlign = value;
    this.view.addClass(this.VALIGN_CLASS_NAMES[this.style.vAlign]);
    if (this.style.vAlign == 'center') {
        this.view.clearChild();
        this.view.addChild(_({
            class: 'as-center-table',
            child: '.as-center-cell'
        }
        ));
        this.viewBinding.$containter = '.as-center-cell';
        this.$containter = $(this.viewBinding.$containter, this.view);
        if (this.childNode) {
            this.$containter.addChild(this.childNode.view);
        }
    }
    this.updateVAlignStyle();
    return value;
};

RelativeAnchor.prototype.setStyleLeft = function (value) {
    if (this.style.hAlign != 'center' && this.style.hAlign != 'right') {
        this.view.addStyle('left', value + 'px');
    }
    else  this.view.removeStyle('left');
    return value;
};



RelativeAnchor.prototype.setStyleRight = function (value) {
    if (this.style.hAlign != 'center' && this.style.hAlign != 'left') {
        this.view.addStyle('right', value + 'px');
    }
    else  this.view.removeStyle('right');

    return value;
};

RelativeAnchor.prototype.setStyleTop = function (value) {
    if (this.style.vAlign != 'center' && this.style.vAlign != 'bottom') {
        this.view.addStyle('top', value + 'px');
    }
    else  this.view.removeStyle('top');

    return value;
};


RelativeAnchor.prototype.setStyleBottom = function (value) {
    if (this.style.vAlign != 'center'&& this.style.vAlign != 'top') {
        this.view.addStyle('bottom', value + 'px');
    }
    else  this.view.removeStyle('bottom');

    return value;
};



RelativeAnchor.prototype.TOP_CLASS_NAME = 'as-relative-anchor-box';

RelativeAnchor.prototype.render = function () {
    var layout = {
        class: [this.TOP_CLASS_NAME, this.HALIGN_CLASS_NAMES[this.style.hAlign], this.VALIGN_CLASS_NAMES[this.style.vAlign]]
    };

    this.viewBinding.$containter = '.' + this.TOP_CLASS_NAME;
    if (this.style.vAlign == 'center') {
        layout.child = {
            class: 'as-center-table',
            child: 'as-center-cell'
        };
        this.viewBinding.$containter = '.as-center-cell';
    }
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
    this.childNode = child;
    child.anchor = this;
    this.$containter.addChild(child.view);
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
    for (var key in this.VALIGN_ACCEPT_STYLE[this.style.vAlign]) {
        if (this.VALIGN_ACCEPT_STYLE[this.style.vAlign][key]) {
            this.view.addStyle(key, this.style[key] + 'px');
        }
        else {
            this.view.removeStyle(key);
        }
    }
};


RelativeAnchor.prototype.updateHAlignStyle = function () {
    for (var key in this.HALIGN_ACCEPT_STYLE[this.style.hAlign]) {
        if (this.HALIGN_ACCEPT_STYLE[this.style.hAlign][key]) {
            this.view.addStyle(key, this.style[key] + 'px');
        }
        else {
            this.view.removeStyle(key);
        }
    }
};







export default RelativeAnchor;