import Fcore from "../core/FCore";
import LinearAnchorEditor from "../anchoreditors/LinearAnchorEditor";
import ChainAnchor from "../anchors/ChainAnchor";
import LinearLayout from "./LinearLayout";
import BaseLayout from "../core/BaseLayout";

var _ = Fcore._;


function ChainLayout() {
    LinearLayout.call(this);
}

Object.defineProperties(ChainLayout.prototype, Object.getOwnPropertyDescriptors(LinearLayout.prototype));
ChainLayout.prototype.constructor = ChainLayout;

ChainLayout.prototype.tag = 'ChainLayout';
ChainLayout.prototype.menuIcon = 'span.mdi.mdi-id-card';

ChainLayout.prototype.TOP_CLASS_NAME = 'as-chain-layout';


ChainLayout.prototype.getAnchorConstructor = function () {
    return ChainAnchor;
};

ChainLayout.prototype.getAnchorEditorConstructor = function () {
    return LinearAnchorEditor;
};


ChainLayout.prototype.getAcceptsStyleNames = function () {
    return BaseLayout.prototype.getAcceptsStyleNames.call(this).concat(['overflowX']);
};


ChainLayout.prototype.setStyleOverflowX = function (value) {
    if (['visible', 'hidden', 'auto'].indexOf(value) < 0) value = 'visible';
    this.view.addStyle('overflowX', value);
    return value;
};


ChainLayout.prototype.getStyleOverflowXDescriptor = function () {
    return {
        type: 'enum',
        values: ['visible', 'hidden', 'auto']
    };
};


ChainLayout.prototype.measureMinSize = function () {
    var width = 0;
    var height = 0;
    var child;
    for (var i = 0; i < this.children.length; ++i) {
        child = this.children[i];
        var minSize = child.measureMinSize();
        width = Math.max(width, child.style.left + minSize.width + child.style.right);
        height = Math.max(height, child.style.top + minSize.height + child.style.bottom);
    }
    return { width: width, height: height };
};


ChainLayout.prototype.render = function () {
    return _({ class: this.TOP_CLASS_NAME });
};


ChainLayout.prototype.onAddChild = function (child, index) {
    var anchor = new ChainAnchor();
    anchor.attachChild(child);
    if (index == -1 || !this.view.childNodes[index]) {
        this.view.addChild(anchor.view);
    }
    else {
        this.view.addChildBefore(anchor.view, this.view.childNodes[index]);
    }
};

ChainLayout.prototype.addChildByPosition = function (child, posX, posY) {
    var bound = this.view.getBoundingClientRect();
    var at = undefined;
    var x;
    for (var i = 0; i < this.children.length; ++i) {
        x = this.children[i].view.getBoundingClientRect().right - bound.left;
        if (x >= posX) {
            at = this.children[i];
            break;
        }
    }

    if (at) {
        this.addChildBefore(child, at);
    }
    else {
        this.addChild(child);
    }
};


export default ChainLayout;