import BaseComponent from "../core/BaseComponent";
import Fcore from "../core/FCore";

var _ = Fcore._;

function TextInput() {
    BaseComponent.call(this);
}

Object.defineProperties(TextInput.prototype, Object.getOwnPropertyDescriptors(BaseComponent.prototype));
TextInput.prototype.constructor = TextInput;

TextInput.prototype.tag = "TextInput";
TextInput.prototype.SUPPORT_STYLE_NAMES = ['width', 'height', 'top', 'left', 'right', 'top', 'bottom'];
TextInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
TextInput.prototype.SUPPORT_EVENT_NAMES = ['change'];

TextInput.prototype.preInit = function () {
    this.style.left = 0;
    this.style.right = 0;
    this.style.top = 0;
    this.style.bottom = 0;
    this.style.height = 30;
    this.style.width = 69;
};

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
    if (this.style.hAlign != 'center')
        this.view.addStyle('width', value + 'px');
};

TextInput.prototype.handleStyleHeight = function (value) {
    BaseComponent.prototype.handleStyleWidth.call(this, this.value);
    if (this.style.vAlign != 'center')
        this.view.addStyle('height', value + 'px');
};


TextInput.prototype.handleStyleHAlign = function (value) {
    BaseComponent.prototype.handleStyleHAlign.call(this, value);
    if (value == 'center') {
        this.view.addStyle('width', this.style.width + 'px')
    }
    else {
        this.view.removeStyle('width');
    }
};


TextInput.prototype.handleStyleVAlign = function (value) {
    BaseComponent.prototype.handleStyleVAlign.call(this, value);
    if (value == 'center') {
        this.view.addStyle('height', this.style.width + 'px')
    }
    else {
        this.view.removeStyle('height');
    }
};


TextInput.prototype.handleAttributeValue = function (value) {
    this.view.value = value;
};

export default TextInput;