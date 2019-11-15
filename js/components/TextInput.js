import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import '../../css/component.css';
import Text from "./Text";


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
            // self.emit('change', this.value, self);
            if (self.events.change)
                console.log("TODO: exec", self.events.change);
        }
    });
};

TextInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.setStyleTextAlign.textAlign = 'left';
    this.attributes.value = '';
    this.attributes.placeHolder = '';
};


TextInput.prototype.render = function () {
    return _('input[type="text"]');
};


TextInput.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['textAlign', 'font', 'fontStyle', 'textSize']);
};


TextInput.prototype.setStyleFont = Text.prototype.setStyleFont;
TextInput.prototype.getStyleFontDescriptor = Text.prototype.getStyleFontDescriptor;

TextInput.prototype.setStyleFontStyle = Text.prototype.setStyleFontStyle;
TextInput.prototype.getStyleFontStyleDescriptor = Text.prototype.getStyleFontStyleDescriptor;

TextInput.prototype.setStyleTextSize = Text.prototype.setStyleTextSize;
TextInput.prototype.getStyleTextSizeDescriptor = Text.prototype.getStyleTextSizeDescriptor;




TextInput.prototype.getStyleTextAlignDescriptor = function () {
    return {
        type: "enum",
        values: ['left', 'center', 'right', 'unset']
    };
};

TextInput.prototype.setStyleTextAlign = function (value) {
    if (['left', 'center', 'right'].indexOf(value) >= 0) {
        this.view.addStyle('text-align', value);
    }
    else {
        value = 'unset';
        this.view.removeStyle('text-align', value);
    }
    return value;
};

TextInput.prototype.setAttributeValue = function (value) {
    this.view.value = value;
    return value;
};


TextInput.prototype.setAttributePlaceHolder = function (value) {
    this.view.attr('placeholder', value);
    return value;
};


TextInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value', 'placeHolder']);
};


TextInput.prototype.getAttributeValueDescriptor = function () {
    return {
        type: "text"
    }
};

TextInput.prototype.getAttributePlaceHolderDescriptor = function () {
    return {
        type: "text"
    }
};


TextInput.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};

export default TextInput;