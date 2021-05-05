import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;

function NumberInput() {
    ScalableComponent.call(this);
}

Object.defineProperties(NumberInput.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
NumberInput.prototype.constructor = NumberInput;

NumberInput.prototype.tag = "NumberInput";
NumberInput.prototype.menuIcon = 'span.mdi.mdi-numeric-2-box-outline';


NumberInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
NumberInput.prototype.SUPPORT_EVENT_NAMES = ['change'];

NumberInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
};

NumberInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('change', function (event) {
        self.attributes.value = event.value;
        if (self.events.change)
            console.log("TODO: exec", self.events.change);
    });
    this.view._debug = true;
    //load default value from view
    this.attributes.min = this.view.min;
    this.attributes.max = this.view.max;
    this.attributes.value = this.view.value;

    this.attributes.decimalSeparator = this.view.decimalSeparator;
    this.attributes.thousandsSeparator = this.view.thousandsSeparator;
    this.attributes.floatFixed = this.view.floatFixed;
};

NumberInput.prototype.render = function () {
    return _('numberinput');
};


NumberInput.prototype.setAttributeValue = function (value) {
    this.view.value = value;
    this.attributes.min = this.view.min == -Infinity ? null : this.view.min;
    this.attributes.max = this.view.max == Infinity ? null : this.view.max;
    return this.view.value;
};


NumberInput.prototype.setAttributeDecimalSerapator = function (value) {
    this.view.decimalSerapator = value;
    return this.view.decimalSerapator;
};


NumberInput.prototype.setAttributeFloatFixed = function (value) {
    this.view.floatFixed = value;
    return this.view.floatFixed;
};


NumberInput.prototype.setAttributeMax = function (value) {
    if (value === null)
        this.view.max = Infinity;
    else this.view.max = value;
    this.attributes.min = this.view.min == -Infinity ? null : this.view.min;
    this.attributes.value = this.view.value;
    return value;
};

NumberInput.prototype.setAttributeMin = function (value) {
    if (value === null)
        this.view.min = -Infinity;
    else this.view.min = value;
    this.attributes.max = this.view.max == Infinity ? null : this.view.max;
    this.attributes.value = this.view.value;
    return value;
};

NumberInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(["value", "floatFixed", 'min', 'max']);
};


NumberInput.prototype.getAttributeValueDescriptor = function () {
    return {
        type: "number",
        max: this.attributes.max,
        min: this.attributes.min
    };
};


NumberInput.prototype.getAttributeFloatFixedDescriptor = function () {
    return {
        type: "number",
        max: 100,
        min: -1
    };
};

NumberInput.prototype.getAttributeMinDescriptor = function () {
    return {
        type: "number",
        nullable: true,
        defaultValue: -Infinity,

    };
};

NumberInput.prototype.getAttributeMaxDescriptor = function () {
    return {
        type: "number",
        nullable: true,
        defaultValue: Infinity
    };
};


NumberInput.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};


NumberInput.prototype.getDataBindingDescriptor = function () {
    var thisC = this;
    return {
        configurable: true,
        set: function (value) {
            thisC.setAttribute('value', value);
        },
        get: function () {
            return thisC.getAttribute('value');
        }
    };
};

export default NumberInput;