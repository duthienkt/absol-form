import Fcore from "../core/FCore";

import '../../css/component.css';
import ScalelessComponent from "../core/ScalelessComponent";

var _ = Fcore._;

function Label() {
    ScalelessComponent.call(this);
}

Object.defineProperties(Label.prototype, Object.getOwnPropertyDescriptors(ScalelessComponent.prototype));
Label.prototype.constructor = Label;

Label.prototype.tag = "Label";
Label.prototype.menuIcon = 'span.mdi.mdi-label-outline';

Label.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
Label.prototype.SUPPORT_EVENT_NAMES = ['change'];


Label.prototype.onCreated = function () {
    ScalelessComponent.prototype.onCreated.call(this);
};

Label.prototype.render = function () {
    return  _('label');
};



Label.prototype.handleAttributeText = function (value) {
    this.view.clearChild().addChild(_({ text: value }))
};

export default Label;