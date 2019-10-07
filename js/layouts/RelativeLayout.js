import RelativeAnchor from "../anchors/RelativeAnchor";
import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;



function RelativeLayout() {
    ScalableComponent.call(this);

}

Object.defineProperties(RelativeLayout.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
RelativeLayout.prototype.constructor = RelativeLayout;

RelativeLayout.prototype.tag = 'RelativeLayout';
RelativeLayout.prototype.menuIcon = 'span.mdi.mdi-relative-scale';

RelativeLayout.prototype.TOP_CLASS_NAME = 'as-relative-layout';
RelativeLayout.prototype.SUPPORT_STYLE_NAMES = ['width', 'height'];//, 'left', 'right', 'top', 'bottom'];

RelativeLayout.prototype.create = function () {
    ScalableComponent.prototype.create.call(this);
    this.style.vAlign = 'fixed';
    this.style.hAlign = 'fixed';
};

RelativeLayout.prototype.getAnchorConstructor = function () {
    return RelativeAnchor;
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
    console.log(component);
    
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

export default RelativeLayout;