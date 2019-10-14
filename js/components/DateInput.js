import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import { beginOfDay } from "absol/src/Time/datetime";


var _ = Fcore._;

function DateInput() {
    ScalableComponent.call(this);
}

Object.defineProperties(DateInput.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
DateInput.prototype.constructor = DateInput;
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
};

DateInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('change', function (event) {
        self.attributes.value = this.value;
        self.emit('change', this.value, self);
    });
};


DateInput.prototype.setAttributeValue = function (value) {
    if (value instanceof Date)
        this.view.value = value;
    else if (typeof value == 'string' || typeof value == "number") {
        this.attributes.value = new Date(value);
        this.view.value = this.attributes.value;
    } else {
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
        defaultValue: beginOfDay(new Date())
    }
}


export default DateInput;