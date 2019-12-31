import Svg from "absol/src/HTML5/Svg";
import BaseShape from "../core/BaseShape";

var _ = Svg.ShareInstance._;
var $ = Svg.ShareInstance.$;

function Ellipse() {
    BaseShape.call(this);
}

Object.defineProperties(Ellipse.prototype, Object.getOwnPropertyDescriptors(BaseShape.prototype));
Ellipse.prototype.constructor = Ellipse;

Ellipse.prototype.tag = "Ellipse";
Ellipse.prototype.menuIcon = "span.mdi.mdi-ellipse-outline";



Ellipse.prototype.renderContent = function () {
    return _('ellipse');
};


Ellipse.prototype.setStyleFillColor = function (value) {
    value = BaseShape.prototype.setStyleFillColor.call(this, value);
    if (this.$content)
        this.$content.addStyle('fill', value);
    return value;
};


Ellipse.prototype.setStyleStrokeColor = function (value) {
    value = BaseShape.prototype.setStyleFillColor.call(this, value);
    if (this.$content)
        this.$content.addStyle('stroke', value);
    return value;
};

Ellipse.prototype.setStyleStrokeWidth = function (value) {
    value = BaseShape.prototype.setStyleStrokeWidth.call(this, value);
    if (this.$content)
        this.$content.addStyle('strokeWidth', value + '');
    this.updateShape();
    return value;
};

Ellipse.prototype.updateShape = function () {
    if (!this.view) return;
    var bound = this.view.getBoundingClientRect();
    this.$content.addStyle({
        cx: bound.width / 2 + '',
        cy: bound.height / 2 + '',
        rx: (bound.width - this.style.strokeWidth - 0.1) / 2 + '',// prevent miss some pixel
        ry: (bound.height - this.style.strokeWidth - 0.1) / 2 + ''
    });
};



export default Ellipse;