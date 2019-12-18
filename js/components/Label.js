import Fcore from "../core/FCore";

import '../../css/component.css';
import ContentScalelessComponent from "../core/ContentScalelessComponent";

var _ = Fcore._;
var $ = Fcore.$;

function Label() {
    ContentScalelessComponent.call(this);
}


Object.defineProperties(Label.prototype, Object.getOwnPropertyDescriptors(ContentScalelessComponent.prototype));
Label.prototype.constructor = Label;

Label.prototype.tag = "Label";
Label.prototype.menuIcon = 'span.mdi.mdi-label-outline';

Label.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
Label.prototype.SUPPORT_EVENT_NAMES = ['change'];

Label.prototype.onCreate = function(){
    ContentScalelessComponent.prototype.onCreate.call(this);
    this.attributes.text = this.attributes.name;
    this.style.height = 15;
};


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
        type:"text"
    }
};

export default Label;