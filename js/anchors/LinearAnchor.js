import Fcore from "../core/FCore";
import FViewable from "../core/FViewable";

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
    return [ 'left', 'right', 'top', 'bottom'];
};


LinearAnchor.prototype.getStyleLeftDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.style.hAlign == 'center' || this.style.hAlign == 'right',
        livePreview: true
    };
};


LinearAnchor.prototype.getStyleRightDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.style.hAlign == 'center' || this.style.hAlign == 'left',
        livePreview: true
    };
};


LinearAnchor.prototype.getStyleTopDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.style.vAlign == 'center' || this.style.vAlign == 'bottom',
        livePreview: true
    };
};


LinearAnchor.prototype.getStyleBottomDescriptor = function () {
    return {
        type: 'number',
        min: -Infinity,
        max: Infinity,
        disabled: this.style.vAlign == 'center' || this.style.vAlign == 'top',
        livePreview: true
    };
};






LinearAnchor.prototype.setStyleLeft = function (value) {
   this.view.addStyle('margin-left', value +'px');
    return value;
};



LinearAnchor.prototype.setStyleRight = function (value) {
    this.view.addStyle('margin-right', value +'px');
    return value;
};

LinearAnchor.prototype.setStyleTop = function (value) {
    this.view.addStyle('margin-top', value +'px');
    return value;
};


LinearAnchor.prototype.setStyleBottom = function (value) {
    this.view.addStyle('margin-bottom', value +'px');
    return value;
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