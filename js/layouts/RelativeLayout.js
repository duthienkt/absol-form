import RelativeAnchor from "../anchors/RelativeAnchor";
import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import RelativeAnchorEditor from "../anchoreditors/RelativeAnchorEditor";

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
    this.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    this.style.backgroundImage = '';
};

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
 * 
 * @returns {{width:Number, height:Number}} 
 */
RelativeLayout.prototype.measureMinSize = function () {
    var width = 0;
    var height = 0;
    var child;
    var cW;
    var cH;
    for (var i = 0; i < this.children.length; ++i) {
        child = this.children[i];
        cW = 0;
        cH = 0;
        switch (child.style.hAlign) {
            case "left":
                cW = child.style.left + child.style.width;
                break;
            case "right":
                cW = child.style.right + child.style.width;
                break;
            case "center":
                cW = child.style.width;
                break;
            case "fixed":
                cW = child.measureMinSize().width + child.style.left + child.style.right;
                break;
        }

        switch (child.style.vAlign) {
            case "top":
                cH = child.style.top + child.style.height;
                break;
            case "bottom":
                cH = child.style.bottom + child.style.height;
                break;
            case "center":
                cH = child.style.height;
                break;
            case "fixed":
                cH = child.measureMinSize().height + child.style.top + child.style.bottom;
                break;
        }
        width = Math.max(cW, width);
        height = Math.max(cH, height);
    }

    return { width: width, height: height };
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



RelativeLayout.prototype.getAcceptsAttributeNames = function () {
    var res = ScalableComponent.prototype.getAcceptsAttributeNames.call(this);
    if (this.attributes.formType) {
        res = ['formType'].concat(res);
    }
    return res;
};

RelativeLayout.prototype.getAttributeFormTypeDescriptor = function () {
    return {
        type: 'const',
        value: this.attributes.formType
    }
};


RelativeLayout.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['backgroundColor', 'backgroundImage']);
};

RelativeLayout.prototype.setStyleBackgroundColor = function (value) {
    this.view.addStyle('backgroundColor', value);
    return value;
};

RelativeLayout.prototype.setStyleBackgroundImage = function (value) {
    if (value && value.length > 0){
        this.view.addStyle('backgroundImage', 'url(' + value + ')');
        this.view.addStyle('backgroundSize', '100% 100%');
    }
    else{
        this.view.removeStyle('backgroundImage');
        this.view.removeStyle('backgroundSize');
    }
    return value;
};

RelativeLayout.prototype.getStyleBackgroundColorDescriptor = function () {
    return {
        type: 'color'
    };
};

RelativeLayout.prototype.getStyleBackgroundImageDescriptor = function () {
    return {
        type: 'text'
    };
};

export default RelativeLayout;