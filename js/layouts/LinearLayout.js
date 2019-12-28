import Fcore from "../core/FCore";
import BaseLayout from "../core/BaseLayout";
import LinearAnchor from "../anchors/LinearAnchor";
import LinearAnchorEditor from "../anchoreditors/LinearAnchorEditor";

var _ = Fcore._;



function LinearLayout() {
    BaseLayout.call(this);

}

Object.defineProperties(LinearLayout.prototype, Object.getOwnPropertyDescriptors(BaseLayout.prototype));
LinearLayout.prototype.constructor = LinearLayout;

LinearLayout.prototype.tag = 'LinearLayout';
LinearLayout.prototype.menuIcon = 'span.mdi.mdi-post-outline';

LinearLayout.prototype.TOP_CLASS_NAME = 'as-linear-layout';
LinearLayout.prototype.SUPPORT_STYLE_NAMES = ['width', 'height'];//, 'left', 'right', 'top', 'bottom'];


LinearLayout.prototype.getAnchorConstructor = function () {
    return LinearAnchor;
};

LinearLayout.prototype.getAnchorEditorConstructor = function () {
    return LinearAnchorEditor;
};



LinearLayout.prototype.render = function () {
    return _({ class: this.TOP_CLASS_NAME });
};


LinearLayout.prototype.onAddChild = function (child, index) {
    var anchor = new LinearAnchor();
    anchor.attachChild(child);
    if (index == -1 || !this.view.childNodes[index]) {
        this.view.addChild(anchor.view);
    }
    else {
        this.view.addChildBefore(anchor.view, this.view.childNodes[index]);
    }
};

LinearLayout.prototype.onRemoveChild = function (child, index) {
    var anchor = child.anchor;
    anchor.detachChild();
    anchor.view.remove();
};

/**
 * @param {BaseComponent} component
 * @returns {BaseComponent} auto set disable style 
 */
LinearLayout.prototype.reMeasureChild = function (component) {
};

/**
 * 
 * @returns {{width:Number, height:Number}} 
 */
LinearLayout.prototype.measureMinSize = function () {
    //todo
    var width = 0;
    var height = 0;

    var child;
    var cW;
    var cH;
    for (var i = 0; i < this.children.length; ++i) {
        child = this.children[i];
        var minSize = child.measureMinSize();
        cW = child.style.left + minSize.width + child.style.right;
        cH = child.style.top + minSize.height + child.style.bottom;
        width = Math.min(cW, width);
        height += cH;
    }
    return { width: width, height: height };
};


LinearLayout.prototype.addChildByPosition = function (child, posX, posY) {
    var at = undefined;
    var y = 0;
    for (var i = 0; i < this.children.length; ++i) {
        at = this.children[i];
        y += at.style.height + at.style.top + at.style.bottom;
        if (y >= posY) {
            break;
        }
    }

    if (y < posY) {
        at = undefined;
    }

    if (at) {
        this.addChildBefore(child, at);
    }
    else {
        this.addChild(child);
    }
};


export default LinearLayout;