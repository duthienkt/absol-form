import Fcore from "../core/FCore";

import '../../css/component.css';
import ScalableComponent from "../core/ScalableComponent";

var _ = Fcore._;
var $ = Fcore.$;

function Label() {
    ScalableComponent.call(this);
}

Object.defineProperties(Label.prototype, Object.getOwnPropertyDescriptors(ScalableComponent.prototype));
Label.prototype.constructor = Label;

Label.prototype.tag = "Label";
Label.prototype.menuIcon = 'span.mdi.mdi-label-outline';

Label.prototype.SUPPORT_ATTRIBUTE_NAMES = ['value'];
Label.prototype.SUPPORT_EVENT_NAMES = ['change'];


Label.prototype.onCreated = function () {
    this.$label = $('label', this.view);
    this.$cell = $('.as-comp-label-cell', this.view);
    ScalableComponent.prototype.onCreated.call(this);
};

Label.prototype.render = function () {
    return _({
        class: 'as-comp-label',

        child: {
            class: 'as-comp-label-cell',
            child: {
                tag: 'label'
            }
        }
    });
};

Label.prototype.handleStyleTextHAlign = function (value) {
    this.view.addStyle('text-align', value);
};

Label.prototype.handleStyleTextVAlign = function (value) {
    if (value == 'center') value = 'middle';
    this.$cell.addStyle('vertical-align', value);
};


Label.prototype.handleAttributeText = function (value) {
    this.$label.clearChild().addChild(_({ text: value }))
};

export default Label;