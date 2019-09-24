import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";


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

DateInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('change', function (event) {
        self.emit('change', this.value, self);
    });
};


DateInput.prototype.handleAttributeValue = function (value) {
    if (value instanceof Date)
        this.view.value = value;
    else {
        this.attributes.value = new Date(value);
        this.view.value = this.attributes.value;
    }
};

export default DateInput;