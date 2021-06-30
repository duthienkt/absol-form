import RelativeAnchor from "../anchors/RelativeAnchor";
import Fcore from "../core/FCore";
import BaseLayout from "../core/BaseLayout";
import RelativeAnchorEditor from "../anchoreditors/RelativeAnchorEditor";
import OOP from "absol/src/HTML5/OOP";
import {AssemblerInstance} from "../core/Assembler";

var _ = Fcore._;


function RelativeLayout() {
    BaseLayout.call(this);

}

OOP.mixClass(RelativeLayout, BaseLayout);


RelativeLayout.prototype.tag = 'RelativeLayout';
RelativeLayout.prototype.menuIcon = 'span.mdi.mdi-relative-scale';

RelativeLayout.prototype.TOP_CLASS_NAME = 'as-relative-layout';
RelativeLayout.prototype.SUPPORT_STYLE_NAMES = ['width', 'height'];//, 'left', 'right', 'top', 'bottom'];


RelativeLayout.prototype.getAnchorConstructor = function () {
    return RelativeAnchor;
};


RelativeLayout.prototype.getAnchorEditorConstructor = function () {
    return RelativeAnchorEditor;
};


RelativeLayout.prototype.render = function () {
    return _({ class: this.TOP_CLASS_NAME });
};


RelativeLayout.prototype.onAddChild = function (child, index) {
    var anchor = new RelativeAnchor();
    anchor.attachChild(child);
    if (index == -1 || !this.view.childNodes[index]) {
        this.view.addChild(anchor.view);
    }
    else {
        this.view.addChildBefore(anchor.view, this.view.childNodes[index]);
    }
};

RelativeLayout.prototype.onRemoveChild = function (child, index) {
    var anchor = child.anchor;
    anchor.detachChild();
    anchor.view.remove();
};


/**
 * @param {BaseComponent} child,
 * @param {Number} posX
 * @param {Number} posY
 */
RelativeLayout.prototype.addChildByPosition = function (child, posX, posY) {
    this.addChild(child);
    var width = this.style.getProperty('width', 'px');
    var height = this.style.getProperty('height', 'px');
    var cWidth = child.style.getProperty('width', 'px');
    var cHeight = child.style.getProperty('height', 'px');
    posX = Math.max(0, Math.min(width - cWidth, posX));
    posY = Math.max(0, Math.min(height - cHeight, posY));
    child.setStyle('left', posX);
    child.setStyle('top', posY);
};


AssemblerInstance.addClass(RelativeLayout);


export default RelativeLayout;