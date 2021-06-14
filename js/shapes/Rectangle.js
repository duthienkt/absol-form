import Svg from "absol/src/HTML5/Svg";
import BaseShape from "../core/BaseShape";
import Ellipse from "./Ellipse";
import {AssemblerInstance} from "../core/Assembler";

var _ = Svg.ShareInstance._;
var $ = Svg.ShareInstance.$;

function Rectangle() {
    BaseShape.call(this);
}

Object.defineProperties(Rectangle.prototype, Object.getOwnPropertyDescriptors(BaseShape.prototype));
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.tag = "Rectangle";
Rectangle.prototype.menuIcon = "span.mdi.mdi-rectangle-outline";


BaseShape.prototype.onCreate = function () {
    BaseShape.prototype.onCreate.call(this);
    this.style.roundCornerX = 0;
    this.style.roundCornerY = 0;
};


Rectangle.prototype.renderContent = function () {
    return _('rect');
};


Rectangle.prototype.setStyleFillColor = Ellipse.prototype.setStyleFillColor;

Rectangle.prototype.setStyleStrokeColor = Ellipse.prototype.setStyleStrokeColor;

Rectangle.prototype.setStyleStrokeWidth = Ellipse.prototype.setStyleStrokeWidth;


Rectangle.prototype.getAcceptsStyleNames = function () {
    return BaseShape.prototype.getAcceptsStyleNames.call(this).concat(['roundCornerX', 'roundCornerY']);
};


Rectangle.prototype.setStyleRoundCornerX = function (value) {
    if (!(value >= 0)) value = 0;
    if (this.$content) {
        this.$content.attr('rx', value === 0 ? undefined : (value + ''))

    }
    return value;
};


Rectangle.prototype.setStyleRoundCornerY = function (value) {
    if (!(value >= 0)) value = 0;
    if (this.$content) this.$content.attr('ry', value === 0 ? undefined : (value + ''));
    return value;
};



Rectangle.prototype.getStyleRoundCornerXDescriptor = function () {
    return {
        type: 'number',
        min: 0,
        max: Infinity,
        sign: 'ShapeRoundCornerX'
    };
};


Rectangle.prototype.getStyleRoundCornerYDescriptor = function () {
    return {
        type: 'number',
        min: 0,
        max: Infinity,
        sign: 'ShapeRoundCornerY'
    };
};


Rectangle.prototype.updateShape = function () {
    if (!this.view) return;
    var bound = this.view.getBoundingClientRect();
    this.$content.attr({
        x: (this.style.strokeWidth + 0.1) / 2,
        y: (this.style.strokeWidth + 0.1) / 2,
        width: (bound.width - this.style.strokeWidth - 0.1) + '',
        height: (bound.height - this.style.strokeWidth - 0.1) + ''
    });
};

AssemblerInstance.addClass(Rectangle);

export default Rectangle;