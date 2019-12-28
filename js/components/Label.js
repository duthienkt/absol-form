import Fcore from "../core/FCore";

import '../../css/component.css';
import ContentScalelessComponent from "../core/ContentScalelessComponent";
import Text from "./Text";

var _ = Fcore._;
var $ = Fcore.$;

function Label() {
    ContentScalelessComponent.call(this);
}


Object.defineProperties(Label.prototype, Object.getOwnPropertyDescriptors(ContentScalelessComponent.prototype));
Label.prototype.constructor = Label;

Label.prototype.tag = "Label";
Label.prototype.menuIcon = 'span.mdi.mdi-label-outline';

Label.prototype.onCreate = function(){
    ContentScalelessComponent.prototype.onCreate.call(this);
    this.attributes.text = this.attributes.name;
    this.style.height = 15;
    this.style.font = undefined;
    this.style.fontStyle = undefined;
    this.style.textSize = 0;
    this.style.textAlign = 'left';
    this.style.textColor = 'black'
};



Label.prototype.getAcceptsStyleNames = function () {
    return ContentScalelessComponent.prototype.getAcceptsStyleNames.call(this).concat(['textAlign', 'font', 'fontStyle', 'textSize', 'textColor']);
};


Label.prototype.setStyleFont = Text.prototype.setStyleFont;
Label.prototype.getStyleFontDescriptor = Text.prototype.getStyleFontDescriptor;

Label.prototype.setStyleFontStyle = Text.prototype.setStyleFontStyle;
Label.prototype.getStyleFontStyleDescriptor = Text.prototype.getStyleFontStyleDescriptor;

Label.prototype.setStyleTextSize = Text.prototype.setStyleTextSize;
Label.prototype.getStyleTextSizeDescriptor = Text.prototype.getStyleTextSizeDescriptor;

Label.prototype.setStyleTextAlign = Text.prototype.setStyleTextAlign;
Label.prototype.getStyleTextAlignDescriptor = Text.prototype.getStyleTextAlignDescriptor;

Label.prototype.setStyleTextColor = Text.prototype.setStyleTextColor;
Label.prototype.getStyleTextColorDescriptor = Text.prototype.getStyleTextColorDescriptor;


Label.prototype.renderContent = function () {
    return _('label');
};


Label.prototype.setAttributeText = function (value) {
    this.$content.clearChild().addChild(_({ text: value }));
    return value;
};

Label.prototype.getAcceptsAttributeNames = function(){
    return ContentScalelessComponent.prototype.getAcceptsAttributeNames.call(this).concat(["text"]);
};

Label.prototype.getAttributeTextDescriptor = function(){
    return {
        type:"text",
        sign:"SimpleText"
    }
};

export default Label;