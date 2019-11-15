import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";
import { FONT_FACES_BY_NAME } from "../font/GoogleFont";

var _ = Fcore._;

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
    this.style.font = undefined;
    this.style.fontStyle = undefined;
    this.style.textSize = 0;

}

Text.prototype.render = function () {
    return _('div.absol-bscroller');
};


Text.prototype.setAttributeText = function (value) {
    this.view.clearChild().addChild(_({ text: value }));
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


Text.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['text']);
};

Text.prototype.getAcceptsStyleNames = function () {
    return ScalableComponent.prototype.getAcceptsStyleNames.call(this).concat(['font', 'fontStyle', 'textSize']);
};


Text.prototype.getAttributeTextDescriptor = function () {
    return {
        type: "text",
        long: true
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



export default Text;