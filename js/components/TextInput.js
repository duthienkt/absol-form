import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;

function TextInput() {
    ScalableComponent.call(this);
}

Object.defineProperties(TextInput.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
TextInput.prototype.constructor = TextInput;

TextInput.prototype.tag = "TextInput";
TextInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
TextInput.prototype.SUPPORT_EVENT_NAMES = ['change'];


TextInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
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


TextInput.prototype.handleAttributeValue = function (value) {
    this.view.value = value;
};

export default TextInput;