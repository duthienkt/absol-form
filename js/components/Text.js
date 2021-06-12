import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import showdown from 'showdown';
import {inheritComponentClass} from "../core/BaseComponent";
import TextStyleHandlers from "./handlers/TextStyleHandlers";

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
        var ref = arguments[arguments.length - 1];
        var currentValue = ref.get();
        if (currentValue !== value) {
            ref.set(value);
            this.attributes.text = this.attributes.text + '';
        }
        return value;
    },
    descriptor: {
        type: "enum",
        values: ['none', 'markdown', 'html'],
        sign: 'TextDecode'
    }
};

Object.assign(Text.prototype.styleHandlers, TextStyleHandlers);





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
    return _('div.absol-bscroller');
};


Text.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['text', 'textDecode']);
};

Text.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['font', 'fontStyle', 'textSize', 'textAlign', 'textColor']);
};

Text.prototype.getDataBindingDescriptor = function () {
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

export default Text;