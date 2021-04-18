import Fcore from "../core/FCore";
import FViewable from "../core/FViewable";
import LinearAnchor from "./LinearAnchor";
import '../../css/chainanchor.css';

var _ = Fcore._;
var $ = Fcore.$;

/***
 * @extends FViewable
 * @constructor
 */
function ChainAnchor() {
    FViewable.call(this);
    this.style.left = 0;
    this.style.right = 0;
    this.style.top = 0;
    this.style.bottom = 0;
    this.style.vAlign = 'top';
    this.childNode = null;

    //for quick binding render
    this.viewBinding = {};

    this.onCreate();
    this.view = this.render();
    this.onCreated();
}

Object.defineProperties(ChainAnchor.prototype, Object.getOwnPropertyDescriptors(LinearAnchor.prototype));
ChainAnchor.prototype.construtor = ChainAnchor;

ChainAnchor.prototype.TOP_CLASS_NAME = 'as-chain-anchor-box';

ChainAnchor.prototype.VALIGN_CLASS_NAMES = {
    top: 'as-valign-top',
    center: 'as-valign-center',
    bottom: 'as-valign-bottom'
};

ChainAnchor.prototype.VALIGN_ACCEPTS_VALUES = ['top', 'center', 'bottom'];


ChainAnchor.prototype.getAcceptsStyleNames = function () {
    return LinearAnchor.prototype.getAcceptsStyleNames.call(this).concat(['vAlign']);
};


ChainAnchor.prototype.setStyleVAlign = function (value) {
    if (this.VALIGN_ACCEPTS_VALUES.indexOf(value) < 0) value = this.VALIGN_ACCEPTS_VALUES[0];
    if (this.VALIGN_CLASS_NAMES[this.style.vAlign]) {
        this.view.removeClass(this.VALIGN_CLASS_NAMES[this.style.vAlign])
    }
    this.view.addClass(this.VALIGN_CLASS_NAMES[value]);
    return value;
};


ChainAnchor.prototype.getStyleVAlignDescriptor = function () {
    return {
        type: 'enum',
        values: this.VALIGN_ACCEPTS_VALUES,
        disabled: false,
        sign: 'ChainAnchor_VAlign',
        independence: true
    };
};


ChainAnchor.prototype.render = function () {
    var layout = {
        class: [this.TOP_CLASS_NAME]
    };
    return _(layout);
};



/**
 * @param {BaseComponent} child
 */
ChainAnchor.prototype.attachChild = function (child) {
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
    this.childNode.style.vAlign = this.childNode.style.vAlign || 'top';

    child.anchor = this;
    this.view.addChild(child.view);
    child.onAnchorAttached();
};


export default ChainAnchor;