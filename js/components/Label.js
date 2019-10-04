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


Label.prototype.renderContent = function () {
    return _('label');
};


Label.prototype.setAttributeText = function (value) {
    this.$content.clearChild().addChild(_({ text: value }));
    return value;
};

export default Label;