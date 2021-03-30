import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import '../../css/component.css';
import Text from "./Text";
import OOP from "absol/src/HTML5/OOP";


var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function TextInput() {
    ScalableComponent.call(this);
}

OOP.mixClass(TextInput, ScalableComponent);

TextInput.prototype.tag = "TextInput";
TextInput.prototype.menuIcon = "span.mdi.mdi-textbox";

TextInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
TextInput.prototype.SUPPORT_EVENT_NAMES = ['change'];


TextInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    this.bindAttribute( 'value');
    var self = this;
    var lastValue;
    this.view
        .on('keydown', function () {
            lastValue = self.attributes.value;
        })
        .on('keyup', function () {
            if (this.value != lastValue) {
                self.attributes.value = this.value;
                self.emit('change', this.value, self);
            }
        });
};

TextInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.setStyleTextAlign.textAlign = 'left';
    this.attributes.value = '';
    this.attributes.placeHolder = '';
    this.style.textType = 'normal';
    this.style.textColor = 'black';
    this.style.textSize = 0;
    this.style.textAlign = 'left';
    this.style.font = 'None';
};


TextInput.prototype.render = function () {
    return _('input[type="text"][autocomplete="off"]');
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

TextInput.prototype.setStyleTextAlign = Text.prototype.setStyleTextAlign;
TextInput.prototype.getStyleTextAlignDescriptor = Text.prototype.getStyleTextAlignDescriptor;

TextInput.prototype.setStyleTextColor = Text.prototype.setStyleTextColor;
TextInput.prototype.getStyleTextColorDescriptor = Text.prototype.getStyleTextColorDescriptor;


TextInput.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['font', 'fontStyle', 'textSize', 'textAlign', 'textColor']);
};


TextInput.prototype.setAttributeValue = function (value) {
    this.view.value = value;
    return value;
};


TextInput.prototype.setAttributePlaceHolder = function (value) {
    this.view.attr('placeholder', value);
    return value;
};

TextInput.prototype.setAttributeTextType = function (value) {
    if (['normal', 'password'].indexOf(value) < 0) value = 'normal';
    this.view.attr('type', ({ normal: 'text', password: 'password' })[value]);
    if (value == 'password') this.view.attr('autocomplete', 'new-password');
    else this.view.attr('autocomplete', undefined);
    return value;
};


TextInput.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['value', 'placeHolder', 'textType']);
};


TextInput.prototype.getAttributeValueDescriptor = function () {
    return {
        type: "text",
        sign: "SimpleText"
    }
};

TextInput.prototype.getAttributePlaceHolderDescriptor = function () {
    return {
        type: "text",
        sign: "SimpleText"
    }
};


TextInput.prototype.getAttributeTextTypeDescriptor = function () {
    return {
        type: "enum",
        values: ['normal', 'password'],
        sign: 'InputTextType'
    }
};


TextInput.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};

TextInput.prototype.getDataBindingDescriptor = function () {
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
}

export default TextInput;