import RelativeAnchor from "../anchors/RelativeAnchor";
import Fcore from "../core/FCore";
import BaseLayout from "../core/BaseLayout";
import RelativeAnchorEditor from "../anchoreditors/RelativeAnchorEditor";

var _ = Fcore._;



function RelativeLayout() {
    BaseLayout.call(this);

}

Object.defineProperties(RelativeLayout.prototype, Object.getOwnPropertyDescriptors(BaseLayout.prototype));
RelativeLayout.prototype.constructor = RelativeLayout;

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
 * @param {BaseComponent} component
 * @returns {BaseComponent} auto set disable style 
 */
RelativeLayout.prototype.reMeasureChild = function (component) {
    if (!window.remesureChecked){
        window.remesureChecked = true;
        console.trace("Remeasure was removed" );
    }
    return;
    
    switch (component.style.hAlign) {
        case "left":
            component.setStyle('right', this.style.width - component.style.left - component.style.width);
            break;
        case "right":
            component.setStyle('left', this.style.width - component.style.right - component.style.width);
            break;
        case "center":
            component.setStyle('right', (this.style.width - component.style.width) / 2);
            component.setStyle('left', (this.style.width - component.style.width) / 2);
            break;
        case "fixed":
            component.setStyle('width', this.style.width - component.style.right - component.style.left);
            break;
    }


    switch (component.style.vAlign) {
        case "top":
            component.setStyle('bottom', this.style.height - component.style.top - component.style.height);
            break;
        case "bottom":
            component.setStyle('top', this.style.height - component.style.bottom - component.style.height);
            break;
        case "center":
            component.setStyle('bottom', (this.style.height - component.style.height) / 2);
            component.setStyle('top', (this.style.height - component.style.height) / 2);
            break;
        case "fixed":
            component.setStyle('height', this.style.height - component.style.bottom - component.style.top);
            break;
    }
};



/**
 * @param {BaseComponent} child,
 * @param {Number} posX
 * @param {Number} posY
 */
RelativeLayout.prototype.addChildByPosition = function (child, posX, posY) {
    this.addChild(child);
    posX = Math.max(0, Math.min(this.style.width - child.style.width, posX));
    posY = Math.max(0, Math.min(this.style.height - child.style.height, posY));
    child.setStyle('left', posX);
    child.setStyle('top', posY);
};




export default RelativeLayout;