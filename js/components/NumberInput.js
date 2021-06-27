import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import inheritComponentClass from "../core/inheritComponentClass";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";

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
        var prev = this.domElt.value;
        this.domElt.value = value;
        if (prev !== this.domElt.value)
            this.pinFire(value);
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
        if (typeof value !== "number") value = -Infinity;
        if (isNaN(value)) value = -Infinity;
        this.domElt.min = value;
    },
    get: function () {
        return this.domElt.min;
    },
    getDescriptor: function () {
        return {
            type: "number",
            nullable: true,
            defaultValue: -10000,
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
        if (typeof value !== "number") value = Infinity;
        if (isNaN(value)) value = Infinity;
        this.domElt.max = value;
    },
    get: function () {
        return this.domElt.max;
    },
    getDescriptor: function () {
        return {
            type: "number",
            nullable: true,
            defaultValue: 10000,
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


NumberInput.prototype.pinHandlers.value = {
    receives: function (value) {
        this.attributes.value = value;
    },
    get: function () {
        return this.domElt.value;
    },
    descriptor: {
        type: 'number'
    }
};


NumberInput.prototype.pinHandlers.min = {
    receives: function (value) {
        this.attributes.min = value;
    },
    descriptor: {
        type: 'number'
    }
};

NumberInput.prototype.pinHandlers.max = {
    receives: function (value) {
        this.attributes.max = value;
    },
    descriptor: {
        type: 'number'
    }
};


NumberInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
};

NumberInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.domElt.on('change', function (event) {
        self.pinFire('value');
    });
    this.view._debug = true;
};

NumberInput.prototype.render = function () {
    return _('numberinput');
};


NumberInput.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};


NumberInput.prototype.createDataBindingDescriptor = function () {
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

AssemblerInstance.addClass(NumberInput);

export default NumberInput;