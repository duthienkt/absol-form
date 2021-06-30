import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import showdown from 'showdown';
import inheritComponentClass from "../core/inheritComponentClass";
import TextStyleHandlers from "./handlers/TextStyleHandlers";
import {AssemblerInstance} from "../core/Assembler";

var _ = Fcore._;

var showDownConverter = new showdown.Converter();


/***
 * @extends ScalableComponent
 * @constructor
 */
function Text() {
    ScalableComponent.call(this);
}

inheritComponentClass(Text, ScalableComponent);

Text.prototype.tag = "Text";
Text.prototype.menuIcon = "span.mdi.mdi-format-color-text";

Text.prototype.attributeHandlers.text = {
    set: function (value) {
        var ref = arguments[arguments.length - 1];
        var prev = ref.get();
        value = (value || '') + '';
        switch (this.attributes.textDecode) {
            case 'html':
                this.domElt.innerHTML = value;
                break;
            case 'markdown':
                this.domElt.innerHTML = showDownConverter.makeHtml(value).trim().replace(/(^<p>)|(<\/p>$)/, '');
                break;
            default:
                this.domElt.clearChild().addChild(_({ text: value }));
        }
        ref.set(value);
        if (prev !== value){
            this.pinFire('value');
            this.notifyChange();
        }
        return value;
    },
    descriptor: {
        type: "text",
        long: true,
        sign: "HyperText"
    }
};


Text.prototype.attributeHandlers.textDecode = {
    set: function (value) {
        if (['none', 'markdown', 'html'].indexOf(value) < 0) value = 'none';
        var ref = arguments[arguments.length - 1];
        var currentValue = ref.get();
        if (currentValue !== value) {
            this.domElt.removeClass('as-decode-' + currentValue);
            this.domElt.addClass('as-decode-' + value);
            ref.set(value);
            this.attributes.text = this.attributes.text + '';//conf 10 p----
        }
        return value;
    },

    export: function (ref) {
        var value = ref.get();
        if (value === 'none') return undefined;
        return value;
    },
    descriptor: {
        type: "enum",
        values: ['none', 'markdown', 'html'],
        sign: 'TextDecode'
    }
};

Object.assign(Text.prototype.styleHandlers, TextStyleHandlers);


Text.prototype.pinHandlers.text = {
    receives: function (value) {
        this.attributes.text = value;
    },
    get: function () {
        return this.attributes.text;
    },
    descriptor: {
        type: 'text'
    }
};


Text.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.text = this.attributes.name;
    this.attributes.textDecode = 'none';
    this.style.font = undefined;
    this.style.fontStyle = undefined;
    this.style.textSize = 0;
    this.style.textAlign = 'left';
    this.style.textColor = 'black';
    this.style.font = 'unset';
};

Text.prototype.render = function () {
    return _('div.absol-bscroller.as-text');
};


Text.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['font', 'fontStyle', 'textSize', 'textAlign', 'textColor']);
};

Text.prototype.createDataBindingDescriptor = function () {
    var thisC = this;
    return {
        set: function (value) {
            thisC.setAttribute('text', value);
        },
        get: function () {
            return thisC.getAttribute('text');
        }
    }
};

AssemblerInstance.addClass(Text);

export default Text;