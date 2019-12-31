import Svg from "absol/src/HTML5/Svg";


import '../../css/component.css';
import ScalableComponent from "../core/ScalableComponent";
import Color from "absol/src/Color/Color";

var _ = Svg.ShareInstance._;
var $ = Svg.ShareInstance.$;

function BaseShape() {
    ScalableComponent.call(this);
}

Object.defineProperties(BaseShape.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
BaseShape.prototype.constructor = BaseShape;

BaseShape.prototype.tag = "BaseShape";

BaseShape.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.style.boxAlign = 'lefttop';
    this.style.fillColor = 'white';
    this.style.strokeColor = 'black';
    this.style.strokeWidth = 1;
    this.style.width =  20;
    this.style.height =  20;
};


BaseShape.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    this.$content = $('.as-base-shape-content', this.view);
};


BaseShape.prototype.render = function () {
    return _({
        tag: 'svg',
        class: 'as-base-shape',
        child: [
            this.renderContent().addClass('as-base-shape-content'),
            { tag: 'attachhook', on: { error: this.updateShape.bind(this) } }
        ]
    });
};


BaseShape.prototype.renderContent = function () {
    throw new Error('Not Implement!');
};


BaseShape.prototype.setStyleWidth = function (value) {
    var res = ScalableComponent.prototype.setStyleWidth.call(this, value);
    this.updateShape();
    return res;
};


BaseShape.prototype.setStyleHeight = function (value) {
    var res = ScalableComponent.prototype.setStyleHeight.call(this, value);
    this.updateShape();
    return res;
};


BaseShape.prototype.updateShape = function () {
    //not implement
};


BaseShape.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['fillColor', 'strokeColor', 'strokeWidth']);
};


BaseShape.prototype.setStyleStrokeWidth = function (value) {
    if (value >= 0) return value;
    return 0;
};


BaseShape.prototype.setStyleFillColor = function (value) {
    var color = undefined;
    try {
        color = Color.parse(value);
    }
    catch (error) {
        color = undefined;
    }
    color = color || new Color([0, 0, 0, 0]);
    return value.toString();
};


BaseShape.prototype.setStyleStrokeColor = BaseShape.prototype.setStyleFillColor;//same as color

BaseShape.prototype.getStyleFillColorDescriptor = function () {
    return {
        type: 'color',
        sign: 'ShapeFillColor'
    };
};


BaseShape.prototype.getStyleStrokeColorDescriptor = function () {
    return {
        type: 'color',
        sign: 'ShapeStrokeColor'
    };
};

BaseShape.prototype.getStyleStrokeWidthDescriptor = function () {
    return {
        type: 'number',
        min: 0,
        max: Infinity,
        sign: 'ShapeStrokeWidth'
    };
};

export default BaseShape;