import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import LinearAnchor from "../anchors/LinearAnchor";
import LinearAnchorEditor from "../anchoreditors/LinearAnchorEditor";

var _ = Fcore._;



function LinearLayout() {
    ScalableComponent.call(this);

}

Object.defineProperties(LinearLayout.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
LinearLayout.prototype.constructor = LinearLayout;

LinearLayout.prototype.tag = 'LinearLayout';
LinearLayout.prototype.menuIcon = 'span.mdi.mdi-post-outline';

LinearLayout.prototype.TOP_CLASS_NAME = 'as-linear-layout';
LinearLayout.prototype.SUPPORT_STYLE_NAMES = ['width', 'height'];//, 'left', 'right', 'top', 'bottom'];

LinearLayout.prototype.create = function () {
    ScalableComponent.prototype.create.call(this);
    this.style.vAlign = 'fixed';
    this.style.hAlign = 'fixed';
};

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
    //todo
    // switch (component.style.hAlign) {
    //     case "left":
    //         component.setStyle('right', this.style.width - component.style.left - component.style.width);
    //         break;
    //     case "right":
    //         component.setStyle('left', this.style.width - component.style.right - component.style.width);
    //         break;
    //     case "center":
    //         component.setStyle('right', (this.style.width - component.style.width) / 2);
    //         component.setStyle('left', (this.style.width - component.style.width) / 2);
    //         break;
    //     case "fixed":
    //         component.setStyle('width', this.style.width - component.style.right - component.style.left);
    //         break;
    // }


    // switch (component.style.vAlign) {
    //     case "top":
    //         component.setStyle('bottom', this.style.height - component.style.top - component.style.height);
    //         break;
    //     case "bottom":
    //         component.setStyle('top', this.style.height - component.style.bottom - component.style.height);
    //         break;
    //     case "center":
    //         component.setStyle('bottom', (this.style.height - component.style.height) / 2);
    //         component.setStyle('top', (this.style.height - component.style.height) / 2);
    //         break;
    //     case "fixed":
    //         component.setStyle('height', this.style.height - component.style.bottom - component.style.top);
    //         break;
    // }
};

/**
 * 
 * @returns {{width:Number, height:Number}} 
 */
LinearLayout.prototype.measureMinSize = function () {
    //todo
    var width = 0;
    var height = 0;
    // var child;
    // var cW;
    // var cH;
    // for (var i = 0; i < this.children.length; ++i) {
    //     child = this.children[i];
    //     cW = 0;
    //     cH = 0;
    //     switch (child.style.hAlign) {
    //         case "left":
    //             cW = child.style.left + child.style.width;
    //             break;
    //         case "right":
    //             cW = child.style.right + child.style.width;
    //             break;
    //         case "center":
    //             cW = child.style.width;
    //             break;
    //         case "fixed":
    //             cW = child.measureMinSize().width + child.style.left + child.style.right;
    //             break;
    //     }

    //     switch (child.style.vAlign) {
    //         case "top":
    //             cH = child.style.top + child.style.height;
    //             break;
    //         case "bottom":
    //             cH = child.style.bottom + child.style.height;
    //             break;
    //         case "center":
    //             cH = child.style.height;
    //             break;
    //         case "fixed":
    //             cH = child.measureMinSize().height + child.style.top + child.style.bottom;
    //             break;
    //     }
    //     width = Math.max(cW, width);
    //     height = Math.max(cH, height);
    // }

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