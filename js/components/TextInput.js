import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import '../../css/component.css';


var _ = Fcore._;

function TextInput() {
    ScalableComponent.call(this);
}

Object.defineProperties(TextInput.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
TextInput.prototype.constructor = TextInput;
TextInput.count = 0;

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
            // self.emit('change', this.value, self);
            if (self.events.change)
                console.log("TODO: exec",  self.events.change);     
        }
    });
};

TextInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.value = '';
    this.attributes.name = "TextInput_" + (TextInput.count++);
    this.attributes.placeHolder = '';
};


TextInput.prototype.render = function () {
    return _('input[type="text"]');
};


TextInput.prototype.setAttributeValue = function (value) {
    this.view.value = value;
    return value;
};


TextInput.prototype.setAttributePlaceHolder = function (value) {
    this.view.attr('placeholder', value);
    return value;
};


TextInput.prototype.getAcceptsAttributeNames = function(){
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value', 'placeHolder']);
};


TextInput.prototype.getAttributeValueDescriptor = function(){
    return {
        type:"text"
    }
};

TextInput.prototype.getAttributePlaceHolderDescriptor = function(){
    return {
        type:"text"
    }
};


TextInput.prototype.getAcceptsEventNames = function(){
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};

export default TextInput;