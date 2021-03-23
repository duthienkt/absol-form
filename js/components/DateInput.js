import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import {beginOfDay} from "absol/src/Time/datetime";
import OOP from "absol/src/HTML5/OOP";


var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function DateInput() {
    ScalableComponent.call(this);
}

OOP.mixClass(DateInput, ScalableComponent);


DateInput.prototype.tag = "DateInput";
DateInput.prototype.menuIcon = "span.mdi.mdi-calendar-edit";
DateInput.prototype.SUPPORT_STYLE_NAMES = ['top', 'left', 'right', 'top', 'bottom', 'width', 'height'];
DateInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
DateInput.prototype.SUPPORT_EVENT_NAMES = ['change'];


DateInput.prototype.render = function () {
    return _('calendarinput');
};


DateInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.value = null;
    this.style.width = 100;
    this.style.height = 30;
};

DateInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('change', function (event) {
        self.attributes.value = this.value;
        self.emit('change', { type: 'change', value: this.value }, self);
    });
};


DateInput.prototype.setAttributeValue = function (value) {
    if (value instanceof Date)
        this.view.value = value;
    else if (typeof value == 'string' || typeof value == "number") {
        this.attributes.value = new Date(value);
        this.view.value = this.attributes.value;
    }
    else {
        this.attributes.value = null;
        this.view.value = this.attributes.value;
    }
    return this.view.value;
};


DateInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value']);
};


DateInput.prototype.getAttributeValueDescriptor = function () {
    return {
        type: 'date',
        nullable: true,
        defaultValue: beginOfDay(new Date()),
        sign: 'SimpleDate'
    }
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


export default DateInput;