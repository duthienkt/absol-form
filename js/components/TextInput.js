import BaseComponent from "../core/BaseComponent";
import AComp from "absol-acomp";

var _ = AComp._;

function TextInput() {
    BaseComponent.call(this);
}

Object.defineProperties(TextInput.prototype, Object.getOwnPropertyDescriptors(BaseComponent.prototype));
TextInput.prototype.constructor = TextInput;

TextInput.prototype.SUPPORT_STYLE_NAMES = ['width', 'height', 'top', 'left', 'right', 'top', 'bottom'];
TextInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
TextInput.prototype.SUPPORT_EVENT_NAMES = ['change'];



TextInput.prototype.onCreated = function () {
    var self = this;
    this.view.on('keyup', function () {
        var lastValue = self.attributes.value;
        if (this.value != lastValue) {
            self.attributes.value = this.value;
            self.emit('change', this.value, self);
        }
    });
};

TextInput.prototype.render = function () {
    return _('input[type="text"]');
};

TextInput.prototype.handleStyleWidth = function (value) {
    BaseComponent.prototype.handleStyleWidth.call(this, this.value);
    this.view.addStyle('width', value + 'px')
};

TextInput.prototype.handleStyleHeight = function (value) {
    BaseComponent.prototype.handleStyleWidth.call(this, this.value);
    this.view.addStyle('height', value + 'px');
};

TextInput.prototype.handleAttributeValue = function (value) {
    this.view.value = value;
};

export default TextInput;