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


ScalableComponent.prototype.onCreate = function () {
    BaseComponent.prototype.onCreate.call(this);
    this.style.hAlign = 'left';
    this.style.vAlign = 'top'
    this.style.left = 0;
    this.style.right = 0;
    this.style.top = 0;
    this.style.bottom = 0;
    this.style.height = 30;
    this.style.width = 69;
};


ScalableComponent.prototype.getAcceptsStyleNames = function () {
    return BaseComponent.prototype.getAcceptsStyleNames.call(this).concat(['width', 'height']);
};




export default ScalableComponent;