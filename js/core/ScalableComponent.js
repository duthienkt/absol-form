import BaseComponent from "../core/BaseComponent";
import Fcore from "../core/FCore";
import inheritComponentClass from "./inheritComponentClass";

var _ = Fcore._;

/***
 * @extends BaseComponent
 * @constructor
 */
function ScalableComponent() {
    BaseComponent.call(this);
}
inheritComponentClass(ScalableComponent, BaseComponent);


ScalableComponent.prototype.tag = "ScalableComponent";
ScalableComponent.prototype.SUPPORT_STYLE_NAMES = ['width', 'height', 'top', 'left', 'right', 'top', 'bottom'];


ScalableComponent.prototype.onCreate = function () {
    BaseComponent.prototype.onCreate.call(this);
    this.style.height = 30;
    this.style.width = 69;
};


ScalableComponent.prototype.getAcceptsStyleNames = function () {
    return BaseComponent.prototype.getAcceptsStyleNames.call(this).concat(['width', 'height']);
};


export default ScalableComponent;