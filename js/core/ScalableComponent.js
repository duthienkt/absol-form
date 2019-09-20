import BaseComponent from "../core/BaseComponent";
import Fcore from "../core/FCore";

var _ = Fcore._;

function ScalableComponent() {
    BaseComponent.call(this);
}

Object.defineProperties(ScalableComponent.prototype, Object.getOwnPropertyDescriptors(BaseComponent.prototype));
ScalableComponent.prototype.constructor = ScalableComponent;

ScalableComponent.prototype.tag = "ScalableComponent";
ScalableComponent.prototype.SUPPORT_STYLE_NAMES = ['width', 'height', 'top', 'left', 'right', 'top', 'bottom'];


ScalableComponent.prototype.preInit = function () {
    this.hAlign = 'left';
    this.vAlign = 'top'
    this.style.left = 0;
    this.style.right = 0;
    this.style.top = 0;
    this.style.bottom = 0;
    this.style.height = 30;
    this.style.width = 69;
};



ScalableComponent.prototype.handleStyleWidth = function (value) {
    BaseComponent.prototype.handleStyleWidth.call(this, this.value);
    if (this.style.hAlign != 'center')
        this.view.addStyle('width', value + 'px');
};

ScalableComponent.prototype.handleStyleHeight = function (value) {
    BaseComponent.prototype.handleStyleWidth.call(this, this.value);
    if (this.style.vAlign != 'center')
        this.view.addStyle('height', value + 'px');
};


ScalableComponent.prototype.handleStyleHAlign = function (value) {
    BaseComponent.prototype.handleStyleHAlign.call(this, value);
    if (value == 'center') {
        this.view.addStyle('width', this.style.width + 'px')
    }
    else {
        this.view.removeStyle('width');
    }
};


ScalableComponent.prototype.handleStyleVAlign = function (value) {
    BaseComponent.prototype.handleStyleVAlign.call(this, value);
    if (value == 'center') {
        this.view.addStyle('height', this.style.width + 'px')
    }
    else {
        this.view.removeStyle('height');
    }
};



export default ScalableComponent;