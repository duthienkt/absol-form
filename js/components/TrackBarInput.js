import {_} from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import OOP from "absol/src/HTML5/OOP";
import {inheritComponentClass} from "../core/BaseComponent";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";

function TrackBarInput() {
    ScalableComponent.call(this);
}

inheritComponentClass(TrackBarInput, ScalableComponent);

TrackBarInput.prototype.tag = 'TrackBarInput';
TrackBarInput.prototype.menuIcon = 'span.mdi.mdi-source-commit.mdi-rotate-90'

TrackBarInput.prototype.render = function () {
    return _('trackbarinput');
};

Object.assign(TrackBarInput.prototype.attributeHandlers, InputAttributeHandlers);

TrackBarInput.prototype.attributeHandlers.value = {
    set: function (value) {
        this.domElt.value = value;
    },
    get: function () {
        return this.domElt.value;
    },
    getDescriptor: function () {
        return {
            type: 'number',
            max: this.domElt.rightValue,
            min: this.domElt.leftValue,
            floatFixed: 2,
            dependency: ['leftValue', 'rightValue']
        };
    }
};

TrackBarInput.prototype.attributeHandlers.leftValue = {
    set: function (value) {
        this.domElt.leftValue = value;
    },
    get: function () {
        return this.domElt.leftValue;
    },
    getDescriptor: function () {
        return {
            type: 'number',
            max: this.domElt.rightValue,
            floatFixed: 2,
            dependency: ['rightValue', 'value']
        };
    }
};


TrackBarInput.prototype.attributeHandlers.rightValue = {
    set: function (value) {
        this.domElt.rightValue = value;
    },
    get: function () {
        return this.domElt.rightValue;
    },
    getDescriptor: function () {
        return {
            type: 'number',
            min: this.domElt.leftValue,
            floatFixed: 2,
            dependency: ['leftValue', 'value']
        };
    }
};

TrackBarInput.prototype.attributeHandlers.unit = {
    set: function (value) {
        this.domElt.unit = value;
    },
    get: function () {
        return this.domElt.unit;
    },
    getDescriptor: function () {
        return {
            type: 'text'
        };
    }
};


TrackBarInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.apply(this, arguments);
    this.style.height = 26;
};

TrackBarInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.apply(this, arguments);
};


TrackBarInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value', 'leftValue', 'rightValue', 'unit'])
        .concat(InputAttributeNames);
};


TrackBarInput.prototype.measureMinSize = function () {
    return { width: 40, height: 26 };
};

AssemblerInstance.addClass(TrackBarInput);

export default TrackBarInput;