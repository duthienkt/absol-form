import Fcore from "../core/FCore";
import FViewable from "../core/FViewable";
import LinearAnchor from "./LinearAnchor";
import '../../css/chainanchor.css';
import {inheritComponentClass} from "../core/BaseComponent";
import makeMapStyleHandler from "./makeMapStyleHandler";

var _ = Fcore._;
var $ = Fcore.$;

/***
 * @extends LinearAnchor
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
    this.domElt = this.render();
    this.onCreated();
}

inheritComponentClass(ChainAnchor, LinearAnchor);

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

['left', 'top', 'bottom', 'width', 'vAlign'].forEach(function (name) {
    ChainAnchor.prototype.styleHandlers[name] = makeMapStyleHandler(name);
});

ChainAnchor.prototype.compStyleHandlers.vAlign = {
    set: function (value) {
        var currentValue = arguments[arguments.length - 1].get();
        if (this.anchor.VALIGN_ACCEPTS_VALUES.indexOf(value) < 0) value = this.anchor.VALIGN_ACCEPTS_VALUES[0];
        if (this.anchor.VALIGN_CLASS_NAMES[currentValue]) {
            this.anchor.domElt.removeClass(this.anchor.VALIGN_CLASS_NAMES[currentValue])
        }
        this.anchor.domElt.addClass(this.anchor.VALIGN_CLASS_NAMES[value]);
        return value;
    },
    descriptor: function () {
        return {
            type: 'enum',
            values: this.anchor.VALIGN_ACCEPTS_VALUES,
            disabled: false,
            sign: 'ChainAnchor_VAlign',
            independence: true
        }
    }
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
    child.anchor = this;
    this.childNode.style.width = this.childNode.style.width || 0;
    this.childNode.style.height = this.childNode.style.height || 0;
    this.childNode.style.left = this.childNode.style.left || 0;
    this.childNode.style.right = this.childNode.style.right || 0;
    this.childNode.style.top = this.childNode.style.top || 0;
    this.childNode.style.bottom = this.childNode.style.bottom || 0;
    this.childNode.style.vAlign = this.childNode.style.vAlign || 'top';

    this.style.left = this.childNode.style.left;
    this.style.right = this.childNode.style.right;
    this.style.top = this.childNode.style.top;
    this.style.bottom = this.childNode.style.bottom;
    this.style.vAlign = this.childNode.style.vAlign;

    this.view.addChild(child.view);
    this.style.loadAttributeHandlers(this.styleHandlers);
    child.style.loadAttributeHandlers(Object.assign({}, child.styleHandlers, this.compStyleHandlers));
    child.onAnchorAttached();
};


export default ChainAnchor;