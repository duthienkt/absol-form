import BaseComponent from "../core/BaseComponent";
import Fcore from "../core/FCore";

var _ = Fcore._;

function ScalelessComponent() {
    BaseComponent.call(this);
}

Object.defineProperties(ScalelessComponent.prototype, Object.getOwnPropertyDescriptors(BaseComponent.prototype));
ScalelessComponent.prototype.constructor = ScalelessComponent;

ScalelessComponent.prototype.tag = "ScalableComponent";
ScalelessComponent.prototype.SUPPORT_STYLE_NAMES = ['top', 'left', 'right', 'top', 'bottom'];


ScalelessComponent.prototype.preInit = function () {
    this.hAlign = 'left';
    this.vAlign = 'top'
    this.style.left = 0;
    this.style.right = 0;
    this.style.top = 0;
    this.style.bottom = 0;
};



ScalelessComponent.prototype.handleStyleWidth = function (value) {
    delete this.style.width;
    //not call anchor update
    // BaseComponent.prototype.handleStyleWidth.call(this, this.value);
};

ScalelessComponent.prototype.handleStyleHeight = function (value) {
    delete this.style.height;
};


ScalelessComponent.prototype.handleStyleHAlign = function (value) {
    if (value == 'fixed') value = 'left';
    this.style.hAlign = value;
    BaseComponent.prototype.handleStyleHAlign.call(this, value);
};


ScalelessComponent.prototype.handleStyleVAlign = function (value) {
    if (value == 'fixed') value = 'top';
    this.style.vAlign = value;
};


ScalelessComponent.prototype.getAceptStyleNames = function () {
    var ac = this.anchor.getAceptStyleNames();
    delete ac.height;
    delete ac.width;
    return ac;
};


export default ScalelessComponent;