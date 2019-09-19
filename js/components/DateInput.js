import BaseComponent from "../BaseComponent";
import AComp from "absol-acomp";

var _ = AComp._;

function DateInput() {
    BaseComponent.call(this);
}

Object.defineProperties(DateInput.prototype, Object.getOwnPropertyDescriptors(BaseComponent.prototype));
DateInput.prototype.constructor = DateInput;

DateInput.prototype.SUPPORT_STYLE_NAMES = ['top', 'left', 'right', 'top', 'bottom', 'width', 'height'];
DateInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
DateInput.prototype.SUPPORT_EVENT_NAMES = ['change'];


DateInput.prototype.render = function () {
    return _('calendarinput');
};

DateInput.prototype.onCreated = function(){
    var self = this;
    this.view.on('change', function(event){
        self.emit('change', this.value, self);
    });
};

DateInput.prototype.handleStyleWidth = function (value) {
    BaseComponent.prototype.handleStyleWidth.call(this, this.value);
    this.view.addStyle('width', value + 'px')
};

DateInput.prototype.handleStyleHeight = function (value) {
    BaseComponent.prototype.handleStyleWidth.call(this, this.value);
    this.view.addStyle('height', value + 'px');
};

DateInput.prototype.handleAttributeValue = function(value){
    this.view.value = value;
};

export default DateInput;