import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import showdown from 'showdown';
import {inheritComponentClass} from "../core/BaseComponent";
import Color from "absol/src/Color/Color";

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


Text.prototype.styleHandlers.textColor = {
    set: function (value) {
        var vColor;
        try {
            if (value instanceof Color) vColor = value;
            else if (typeof value === 'string') {
                vColor = Color.parse(value)
            }
            else vColor = new Color([0, 0, 0, 0]);
        } catch (err) {
            console.error(err);
            vColor = new Color([0, 0, 0, 0]);
        }
        value = vColor.toString('HEX8');
        this.domElt.addStyle('color', value);
        return value;
    },
    descriptor: {
        type: "color",
        sign: "TextColor"
    }
};

Text.prototype.styleHandlers.textSize = {
    set: function (value) {
        if (value > 0) {
            this.domElt.addStyle('font-size', value + 'px');
        }
        else {
            this.domElt.removeStyle('font-size');
            value = undefined;
        }

        return value;
    },
    descriptor: {
        type: "FontSize",
        sign: "FontSize"
    }
};

Text.prototype.styleHandlers.font = {
    set: function (value) {
        if (value)
            this.domElt.addStyle('font-family', value);
        else
            this.domElt.removeStyle('font-family');
        return value;
    },
    descriptor: {
        type: "font",
        sign: 'TextFont'
    }
};

Text.prototype.styleHandlers.fontStyle = {
    set: function (value) {
        if (!this.fontStyle2DomStyle[value]) value = 'Regular';
        this.domElt.addStyle(this.fontStyle2DomStyle[value] || this.fontStyle2DomStyle.Regular);
    },
    descriptor: {
        type: "enum",
        values: ['Regular',
            'Italic', 'Bold', 'Bold italic'],
        sign: 'FontStyle'
    },
    export: function () {
        var value = arguments[arguments.length - 1].get();
        if (value === 'Regular') return undefined;
        return value;
    }
};

Text.prototype.fontStyle2DomStyle = {
    Regular: {
        fontWeight: 'normal',
        fontStyle: 'normal'
    },
    Bold: {
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    'Bold italic': {
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    Italic: {
        fontWeight: 'normal',
        fontStyle: 'italic'
    }
};

Text.prototype.styleHandlers.textAlign = {
    set: function (value) {
        if (['left', 'center', 'right'.indexOf(value) >= 0])
            this.domElt.addStyle('text-align', value);
        else
            this.domElt.addStyle('text-align', 'left');
        return value;
    },
    descriptor: {
        type: "textAlign",
        sign: "TextAlign"
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
    this.style.font = 'None';
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