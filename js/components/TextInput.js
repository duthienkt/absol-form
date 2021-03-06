import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import '../../css/component.css';
import Text from "./Text";
import inheritComponentClass from "../core/inheritComponentClass";
import InputAttributeHandlers, {InputAttributeNames} from "./handlers/InputAttributeHandlers";
import {AssemblerInstance} from "../core/Assembler";


var _ = Fcore._;

/***
 * @extends ScalableComponent
 * @constructor
 */
function TextInput() {
    ScalableComponent.call(this);
}

inheritComponentClass(TextInput, ScalableComponent, Text);
delete TextInput.prototype.attributeHandlers.text;
delete TextInput.prototype.attributeHandlers.textDecode;

TextInput.prototype.tag = "TextInput";
TextInput.prototype.menuIcon = "span.mdi.mdi-form-textbox";

TextInput.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
TextInput.prototype.SUPPORT_EVENT_NAMES = ['change'];

Object.assign(TextInput.prototype.attributeHandlers, InputAttributeHandlers);

TextInput.prototype.attributeHandlers.value = {
    set: function (value) {
        var prev = this.domElt.value;
        this.domElt.value = value;
        if (prev !== this.domElt.value) {
            this.pinFire('value');
            this.notifyChange();
        }
    },
    get: function () {
        return this.domElt.value;
    },
    descriptor: {
        type: "text",
        sign: "SimpleText"
    }
};

TextInput.prototype.attributeHandlers.placeHolder = {
    set: function (value) {
        this.domElt.placeholder = value;
    },
    get: function () {
        return this.domElt.placeholder;
    },
    descriptor: {
        type: "text",
        sign: "TextPlaceHolder"
    },
    export: function () {
        var value = this.domElt.placeholder;
        return value || undefined;
    }
};


TextInput.prototype.attributeHandlers.textType = {
    set: function (value) {
        if (['normal', 'password'].indexOf(value) < 0) value = 'normal';
        this.domElt.attr('type', ({ normal: 'text', password: 'password' })[value]);
        if (value === 'password') this.domElt.attr('autocomplete', 'new-password');
        else this.domElt.attr('autocomplete', undefined);
        return value;
    },
    descriptor: {
        type: "enum",
        values: ['normal', 'password'],
        sign: 'InputTextType'
    },
    export: function () {
        var ref = arguments[arguments.length - 1];
        var value = ref.get();
        return value === 'normal' ? undefined : value;
    }
};

TextInput.prototype.pinHandlers.value = {
    get: function () {
        return this.attributes.value;
    },
    receives: function (value) {
        this.attributes.value = value;
    }
};

TextInput.prototype.onCreated = function () {
    ScalableComponent.prototype.onCreated.call(this);
    var self = this;
    var lastValue;
    this.domElt
        .on('keydown', function () {
            lastValue = self.attributes.value;
        })
        .on('keyup', function () {
            if (this.value !== lastValue) {
                self.emit('change', this.value, self);
                self.pinFire('value');
                self.notifyChange();
            }
        });
};

TextInput.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.style.textAlign = 'left';
    this.attributes.value = '';
    this.attributes.placeHolder = '';
    this.style.textType = 'normal';
    this.style.textColor = 'black';
    this.style.textSize = 0;
    this.style.textAlign = 'left';
    this.style.font = 'unset';
};


TextInput.prototype.render = function () {
    return _('input[type="text"][autocomplete="off"]');
};


TextInput.prototype.getAcceptsStyleNames = function () {
    return Text.prototype.getAcceptsStyleNames.call(this);
};


TextInput.prototype.getAcceptsEventNames = function () {
    return ScalableComponent.prototype.getAcceptsEventNames.call(this).concat(['change']);
};


TextInput.prototype.createDataBindingDescriptor = function () {
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
};

AssemblerInstance.addClass(TextInput);

export default TextInput;