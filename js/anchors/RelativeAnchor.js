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
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.childNode.style.hAlign == 'center' || this.childNode.style.hAlign == 'right',
        livePreview: true
    };
};


RelativeAnchor.prototype.getStyleRightDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.childNode.style.hAlign == 'center' || this.childNode.style.hAlign == 'left',
        livePreview: true
    };
};


RelativeAnchor.prototype.getStyleTopDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.childNode.style.vAlign == 'center' || this.childNode.style.vAlign == 'bottom',
        livePreview: true
    };
};


RelativeAnchor.prototype.getStyleBottomDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.childNode.style.vAlign == 'center' || this.childNode.style.vAlign == 'top',
        livePreview: true
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

RelativeAnchor.prototype.setStyleLeft = function (value) {
    var styleValue = value >= 0 ? value + 'px' : value;
    if (this.childNode.style.hAlign != 'center' && this.childNode.style.hAlign != 'right') {
        this.view.addStyle('left', styleValue);
    }
    else this.view.removeStyle('left');
    return value;
};



RelativeAnchor.prototype.setStyleRight = function (value) {
    var styleValue = value >= 0 ? value + 'px' : value;
    if (this.childNode.style.hAlign != 'center' && this.childNode.style.hAlign != 'left') {
        this.view.addStyle('right', styleValue);
    }
    else this.view.removeStyle('right');

    return value;
};

RelativeAnchor.prototype.setStyleTop = function (value) {
    var styleValue = value >= 0 ? value + 'px' : value;
    if (this.childNode.style.vAlign != 'center' && this.childNode.style.vAlign != 'bottom') {
        this.view.addStyle('top', styleValue);
    }
    else this.view.removeStyle('top');
    return value;
};


RelativeAnchor.prototype.setStyleBottom = function (value) {
    var styleValue = value >= 0 ? value + 'px' : value;
    if (this.childNode.style.vAlign != 'center' && this.childNode.style.vAlign != 'top') {
        this.view.addStyle('bottom', styleValue);
    }
    else this.view.removeStyle('bottom');

    return value;
};


RelativeAnchor.prototype.setStyleWidth = function (value) {
    var styleValue = value >= 0 ? value + 'px' : value;
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
            if (this.hAlign == 'fixed') {
                this.view.removeStyle('width', styleValue);
            }
            else {
                this.view.addStyle('width', styleValue);
            }
        }
    }
    return value;
};

RelativeAnchor.prototype.setStyleHeight = function (value) {
    var styleValue = value >= 0 ? value + 'px' : value;
    if (this.childNode.style.vAlign == 'center') {
        this.view.removeStyle('height');
        this.childNode.view.addStyle('height', styleValue);// set height to cell will be fail
    }
    else {
        this.childNode.view.removeStyle('height');
        if (this.vAlign == 'fixed') {
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
    console.log(this.childNode.view, this.childNode.style.vAlign);

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
        type: 'measure'
        // disabled: this.style.hAlign == 'fixed',
        // type: 'number',
        // min: this.measureMinSize().width,
        // max: Infinity,
        // livePreview: true
        // type:'text'

    };
};

RelativeAnchor.prototype.getStyleHeightDescriptor = function () {
    return {
        type: 'measure'
        // disabled: this.style.vAlign == 'fixed',
        // type: 'number',
        // min: this.measureMinSize().height,
        // max: Infinity,
        // livePreview: true
        // type:'text'
    };
};

export default RelativeAnchor;