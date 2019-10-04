import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import '../../css/component.css';


var _ = Fcore._;

function TextInput() {
    ScalableComponent.call(this);
}

Object.defineProperties(TextInput.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
TextInput.prototype.constructor = TextInput;

TextInput.prototype.tag = "TextInput";
TextInput.prototype.menuIcon = "span.mdi.mdi-textbox";

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

TextInput.prototype.create = function(){
    ScalableComponent.prototype.create.call(this);
    this.attributes.value = '';
}

TextInput.prototype.render = function () {
    return _('input[type="text"]');
};


TextInput.prototype.setAttributeValue = function (value) {
    this.view.value = value;
    return value;
};

export default TextInput;