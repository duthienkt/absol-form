import Fcore from "../core/FCore";
import LinearAnchorEditor from "../anchoreditors/LinearAnchorEditor";
import ChainAnchor from "../anchors/ChainAnchor";
import LinearLayout from "./LinearLayout";

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
    //todo use default
    var at = undefined;
    // var y = 0;
    // for (var i = 0; i < this.children.length; ++i) {
    //     at = this.children[i];
    //     y += at.style.height + at.style.top + at.style.bottom;
    //     if (y >= posY) {
    //         break;
    //     }
    // }

    // if (y < posY) {
    //     at = undefined;
    // }

    if (at) {
        this.addChildBefore(child, at);
    }
    else {
        this.addChild(child);
    }
};


export default ChainLayout;