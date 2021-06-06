import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import {inheritComponentClass} from "../core/BaseComponent";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";

var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function NumberInput() {
    ScalableComponent.call(this);
}

inheritComponentClass(NumberInput, ScalableComponent);

NumberInput.prototype.tag = "NumberInput";
NumberInput.prototype.menuIcon = 'span.mdi.mdi-numeric-2-box-outline';


NumberInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
NumberInput.prototype.SUPPORT_EVENT_NAMES = ['change'];

Object.assign(NumberInput.prototype.attributeHandlers, InputAttributeHandlers);

NumberInput.prototype.attributeHandlers.value = {
    set: function (value) {
        this.domElt.value = value;
    },
    get: function () {
        return this.domElt.value;
    },
    getDescriptor: function () {
        return {
            type: "number",
            max: this.attributes.max,
            min: this.attributes.min
        };
    }
};


NumberInput.prototype.attributeHandlers.min = {
    set: function (value) {
        this.domElt.min = value;
    },
    get: function () {
        return this.domElt.min;
    },
    getDescriptor: function () {
        return {
            type: "number",
            nullable: true,
            defaultValue: -Infinity,
        };
    },
    export: function () {
        var value = this.attributes.min;
        if (value === -Infinity) return undefined;
        return value;
    }
};


NumberInput.prototype.attributeHandlers.max = {
    set: function (value) {
        this.domElt.max = value;
    },
    get: function () {
        return this.domElt.max;
    },
    getDescriptor: function () {
        return {
            type: "number",
            nullable: true,
            defaultValue: Infinity,
        };
    },
    export: function () {
        var value = this.attributes.max;
        if (value === Infinity) return undefined;
        return value;
    }
};

NumberInput.prototype.attributeHandlers.decimalSeparator = {
    set: function (value) {
        this.domElt.decimalSeparator = value;
    },
    get: function () {
        return this.domElt.decimalSeparator;
    },
    descriptor: {
        type: 'enum',
        values: ['', ',', '.']
    },
    export: function () {
        var value = this.attributes.decimalSeparator;
        if (!value || value === '') return undefined;
        return value;
    }
};

NumberInput.prototype.attributeHandlers.floatFixed = {
    set: function (value) {
        this.domElt.floatFixed = value;
    },
    get: function () {
        return this.domElt.floatFixed;
    },
    descriptor: {
        type: "number",
        max: 100,
        min: -1
    }
};


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
};

NumberInput.prototype.render = function () {
    return _('numberinput');
};


NumberInput.prototype.setAttributeFloatFixed = function (value) {
    this.view.floatFixed = value;
    return this.view.floatFixed;
};


NumberInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(["value", "floatFixed", 'min', 'max'])
        .concat(InputAttributeNames);
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