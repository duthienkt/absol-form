import {_} from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import OOP from "absol/src/HTML5/OOP";

function TrackBarInput() {
    ScalableComponent.call(this);
}

OOP.mixClass(TrackBarInput, ScalableComponent);

TrackBarInput.prototype.tag = 'TrackBarInput';
TrackBarInput.prototype.menuIcon = 'span.mdi.mdi-source-commit.mdi-rotate-90'

TrackBarInput.prototype.render = function () {
    return _('trackbarinput');
};

TrackBarInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.apply(this, arguments);
    this.style.height = 26;
};

TrackBarInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.apply(this, arguments);
    this.bindAttribute('value');
    this.bindAttribute('leftValue');
    this.bindAttribute('rightValue');
    this.bindAttribute('unit');
};

TrackBarInput.prototype.getAttributeValueDescriptor = function () {
    return {
        type: 'number',
        max: this.view.rightValue,
        min: this.view.leftValue,
        floatFixed: 2,
        dependency: ['leftValue', 'rightValue']
    };
};

TrackBarInput.prototype.getAttributeLeftValueDescriptor = function () {
    return {
        type: 'number',
        max: this.view.rightValue,
        floatFixed: 2,
        dependency:['rightValue', 'value']
    };
};

TrackBarInput.prototype.getAttributeRightValueDescriptor = function () {
    return {
        type: 'number',
        min: this.view.leftValue,
        floatFixed: 2,
        dependency:['leftValue', 'value']
    };
};



TrackBarInput.prototype.getAcceptsAttributeNames = function (){
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value', 'leftValue', 'rightValue']);
};


TrackBarInput.prototype.measureMinSize = function () {
    return { width: 40, height: 26 };
};


export default TrackBarInput;