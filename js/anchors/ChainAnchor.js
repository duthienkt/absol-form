import Fcore from "../core/FCore";
import FViewable from "../core/FViewable";
import LinearAnchor from "./LinearAnchor";

var _ = Fcore._;
var $ = Fcore.$;

function ChainAnchor() {
    // LinearAnchor.call(this);// inherit 
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
        sign: 'ChainAnchor_VAlign'
    };
};


ChainAnchor.prototype.render = function () {
    var layout = {
        class: [this.TOP_CLASS_NAME]
    };
    return _(layout);
};



export default ChainAnchor;