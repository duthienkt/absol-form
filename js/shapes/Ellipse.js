import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import Svg from "absol/src/HTML5/Svg";

var _ = Svg.ShareInstance._;
var $ = Svg.ShareInstance.$;

function Circle() {
    ScalableComponent.call(this);
}

Object.defineProperties(Circle.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
Circle.prototype.constructor = Circle;

Circle.prototype.tag = "Circle";
Circle.prototype.menuIcon = "span.mdi.mdi-image-outline";

Circle.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
};

Circle.prototype.onCreated = function () {
    this.$circle = $('ellipse', this.view);
    ScalableComponent.prototype.onCreated.call(this);
    this.updateShape();
};

Circle.prototype.render = function () {
    return _({
        tag: 'svg',
        child: 'ellipse '
    });
};


Circle.prototype.setStyleWidth = function (value) {
    var res = ScalableComponent.prototype.setStyleWidth.call(this, value);
    this.updateShape();
    return res;
};


Circle.prototype.setStyleHeight = function (value) {
    var res = ScalableComponent.prototype.setStyleWidth.call(this, value);
    this.updateShape();
    return res;
};

Circle.prototype.updateShape = function () {
    if (!this.view) return;
    var bound = this.view.getBoundingClientRect();
    
    this.$circle.addStyle({
        cx: bound.width / 2 + '',
        cy: bound.height / 2 + '',
        rx: bound.width / 2 + '',
        ry: bound.height / 2 + ''
    });
};





export default Circle;