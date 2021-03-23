import Fcore from "../core/FCore";

import '../../css/component.css';
import ContentScalelessComponent from "../core/ContentScalelessComponent";
import Text from "./Text";
import OOP from "absol/src/HTML5/OOP";

var _ = Fcore._;
var $ = Fcore.$;

/***
 * @extends ContentScalelessComponent
 * @constructor
 */
function Label() {
    ContentScalelessComponent.call(this);
}

OOP.mixClass(Label, ContentScalelessComponent);


Label.prototype.tag = "Label";
Label.prototype.menuIcon = 'span.mdi.mdi-label-outline';

Label.prototype.onCreate = function () {
    ContentScalelessComponent.prototype.onCreate.call(this);
    this.attributes.text = this.attributes.name;
    this.style.height = 15;
    this.style.font = undefined;
    this.style.fontStyle = undefined;
    this.style.textSize = 0;
    this.style.textColor = 'black'
};


Label.prototype.getAcceptsStyleNames = function () {
    return ContentScalelessComponent.prototype.getAcceptsStyleNames.call(this).concat(['font', 'fontStyle', 'textSize', 'textColor']);
};


Label.prototype.setStyleFont = Text.prototype.setStyleFont;
Label.prototype.getStyleFontDescriptor = Text.prototype.getStyleFontDescriptor;

Label.prototype.setStyleFontStyle = Text.prototype.setStyleFontStyle;
Label.prototype.getStyleFontStyleDescriptor = Text.prototype.getStyleFontStyleDescriptor;

Label.prototype.setStyleTextSize = Text.prototype.setStyleTextSize;
Label.prototype.getStyleTextSizeDescriptor = Text.prototype.getStyleTextSizeDescriptor;


Label.prototype.setStyleTextColor = Text.prototype.setStyleTextColor;
Label.prototype.getStyleTextColorDescriptor = Text.prototype.getStyleTextColorDescriptor;


Label.prototype.renderContent = function () {
    return _('label');
};


Label.prototype.setAttributeText = function (value) {
    this.$content.clearChild().addChild(_({ text: value }));
    return value;
};

Label.prototype.getAcceptsAttributeNames = function () {
    return ContentScalelessComponent.prototype.getAcceptsAttributeNames.call(this).concat(["text"]);
};

Label.prototype.getAttributeTextDescriptor = function () {
    return {
        type: "text",
        sign: "SimpleText"
    }
};

Label.prototype.getDataBindingDescriptor = function () {
    var thisC = this;
    return {
        configurable: true,
        get: function () {
            return thisC.getAttribute('text');
        },
        set: function (value) {
            thisC.setAttribute('text', value);
        }
    };
};

export default Label;