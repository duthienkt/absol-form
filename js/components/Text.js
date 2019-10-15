import Fcore from "../core/FCore";
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;

function Text() {
    ScalableComponent.call(this);
}

Object.defineProperties(Text.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
Text.prototype.constructor = Text;

Text.prototype.tag = "Text";
Text.prototype.menuIcon = "span.mdi.mdi-format-color-text";
Text.count = 0;

Text.prototype.onCreate = function () {
    ScalableComponent.prototype.onCreate.call(this);
    this.attributes.name = 'Text_' + (Text.count++);
    this.attributes.text = this.attributes.name;
}

Text.prototype.render = function () {
    return _('div.absol-bscroller');
};


Text.prototype.setAttributeText = function (value) {
    this.view.clearChild().addChild(_({ text: value }));
    return value;
};


Text.prototype.getAcceptsAttributeNames = function () {
    return ScalableComponent.prototype.getAcceptsAttributeNames.call(this).concat(['text']);
};


Text.prototype.getAttributeTextDescriptor = function () {
    return {
        type: "text",
        long: true
    };
};

export default Text;