import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import {beginOfDay} from "absol/src/Time/datetime";
import OOP from "absol/src/HTML5/OOP";
import {inheritComponentClass} from "../core/BaseComponent";
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
DateInput.prototype.SUPPORT_STYLE_NAMES = ['top', 'left', 'right', 'top', 'bottom', 'width', 'height'];
DateInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
DateInput.prototype.SUPPORT_EVENT_NAMES = ['change'];

Object.assign(DateInput.prototype.attributeHandlers, InputAttributeHandlers);

DateInput.prototype.attributeHandlers.value = {
    set: function (value) {
        if (value instanceof Date)
            this.view.value = value;
        else if (typeof value == 'string' || typeof value == "number") {
            value = new Date(value);
            this.view.value = value;
        }
        else {
            value = null;
            this.view.value = null;
        }
        return this.view.value;
    },
    get: function () {
        return this.view.value;
    }
};


DateInput.prototype.render = function () {
    return _('dateinput');
};


DateInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.value = null;
    this.style.width = 100;
    this.style.height = 30;
};



DateInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value']).concat(InputAttributeNames);
};


DateInput.prototype.getAttributeValueDescriptor = function () {
    return {
        type: 'date',
        nullable: true,
        defaultValue: beginOfDay(new Date()),
        sign: 'SimpleDate'
    };
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

AssemblerInstance.addClass(DateInput);


export default DateInput;