import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import showdown from 'showdown';

var _ = Fcore._;

var showDownConverter = new showdown.Converter();

function Text() {
    ScalableComponent.call(this);
}

Object.defineProperties(Text.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
Text.prototype.constructor = Text;

Text.prototype.tag = "Text";
Text.prototype.menuIcon = "span.mdi.mdi-format-color-text";

Text.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.text = this.attributes.name;
    this.attributes.textDecode = 'none';
    this.style.font = undefined;
    this.style.fontStyle = undefined;
    this.style.textSize = 0;
    this.style.textAlign = 'left';
    this.style.textColor = 'black';
};

Text.prototype.render = function () {
    return _('div.absol-bscroller');
};


Text.prototype.setAttributeText = function (value) {
    console.log(value, this.attributes.textDecode);

    switch (this.attributes.textDecode) {
        case 'html':
            this.view.innerHTML = value;
            break;
        case 'markdown':
            this.view.innerHTML = showDownConverter.makeHtml(value).trim().replace(/(^<p>)|(<\/p>$)/, '');
            break;
        default:
            this.view.clearChild().addChild(_({ text: value }));
    }
    return value;
};


Text.prototype.setAttributeTextDecode = function (value) {
    this.attributes.textDecode = value;
    this.setAttributeText(this.attributes.text);//update
    return value;
};


Text.prototype.setStyleFont = function (value) {
    if (value)
        this.view.addStyle('font-family', value);
    else
        this.view.removeStyle('font-family');
    return value;
};

Text.prototype.setStyleFontStyle = function (value) {
    var styleList = {
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
    }
    this.view.addStyle(styleList[value] || styleList.Regular);
    return value;
};

Text.prototype.setStyleTextSize = function (value) {

    if (value > 0)
        this.view.addStyle('font-size', value + 'px');
    else
        this.view.removeStyle('font-size');
    return value;
};

Text.prototype.setStyleTextAlign = function (value) {
    if (['left', 'center', 'right'.indexOf(value) >= 0])
        this.view.addStyle('text-align', value);
    else
        this.view.addStyle('text-align', 'left');
    return value;
};


Text.prototype.setStyleTextColor = function (value) {
    this.view.addStyle('color', value);
    return value;
};


Text.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['text', 'textDecode']);
};

Text.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['font', 'fontStyle', 'textSize', 'textAlign', 'textColor']);
};


Text.prototype.getAttributeTextDescriptor = function () {
    return {
        type: "text",
        long: true
    };
};


Text.prototype.getAttributeTextDecodeDescriptor = function () {
    return {
        type: "enum",
        values: ['none', 'markdown', 'html']
    };
};


Text.prototype.getStyleFontDescriptor = function () {
    return {
        type: "font"
    };
};


Text.prototype.getStyleFontStyleDescriptor = function () {
    return {
        type: "enum",
        values: ['Regular',
            'Italic', 'Bold', 'Bold italic']
    };
};

Text.prototype.getStyleTextSizeDescriptor = function () {
    return {
        type: "number",
        min: 0,
        max: 1000
    };
};


Text.prototype.getStyleTextAlignDescriptor = function () {
    return {
        type: "textAlign"
    };
};

Text.prototype.getStyleTextColorDescriptor = function () {
    return {
        type: "color"
    };
};



export default Text;