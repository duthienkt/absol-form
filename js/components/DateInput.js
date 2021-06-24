import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import {beginOfDay, compareDate} from "absol/src/Time/datetime";
import OOP from "absol/src/HTML5/OOP";
import inheritComponentClass from "../core/inheritComponentClass";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";


var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function DateInput() {
    ScalableComponent.call(this);
}

inheritComponentClass(DateInput, ScalableComponent);


DateInput.prototype.tag = "DateInput";
DateInput.prototype.menuIcon = "span.mdi.mdi-calendar-edit";

DateInput.prototype.SUPPORT_EVENT_NAMES = ['change'];

Object.assign(DateInput.prototype.attributeHandlers, InputAttributeHandlers);

DateInput.prototype.attributeHandlers.value = {
    set: function (value) {
        var prev = this.domElt.value;
        if (value instanceof Date)
            this.domElt.value = value;
        else if (typeof value == 'string' || typeof value == "number") {
            value = new Date(value);
            this.domElt.value = value;
        }
        else {
            value = null;
            this.domElt.value = null;
        }
        var cur = this.domElt.value;
        if (prev !== cur || (prev && cur && compareDate(prev, cur) !== 0))
            this.pinFire('value');
    },
    get: function () {
        return this.view.value;
    },
    descriptor: {
        type: 'date',
        nullable: true,
        defaultValue: beginOfDay(new Date()),
        sign: 'SimpleDate'
    }
};


DateInput.prototype.pinHandlers.min = {
    receives: function (value) {
        this.domElt.min = value;
    },
    descriptor: {
        type: "Date"
    }
};

DateInput.prototype.pinHandlers.max = {
    receives: function (value) {
        this.domElt.max = value;
    },
    descriptor: {
        type: "Date"
    }
};
DateInput.prototype.pinHandlers.value = {
    receives: function (value) {
        this.attributes.value = value;
    },
    get: function () {
        return this.domElt.value;
    },
    descriptor: {
        type: "Date"
    }
}


DateInput.prototype.render = function () {
    return _('dateinput');
};


DateInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.value = null;
    this.style.width = 100;
    this.style.height = 30;
};


DateInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    this.domElt.on('change', this.ev_inputChange.bind(this));
};


DateInput.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};

DateInput.prototype.measureMinSize = function () {
    return { width: 75, height: 16 };
};

DateInput.prototype.getDataBindingDescriptor = function () {
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

DateInput.prototype.ev_inputChange = function () {
    this.pinFire('value');
};

AssemblerInstance.addClass(DateInput);


export default DateInput;