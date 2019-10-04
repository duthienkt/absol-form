import Fcore from "../core/FCore";

import '../../css/component.css';
import ContentScalelessComponent from "../core/ContentScalelessComponent";

var _ = Fcore._;
var $ = Fcore.$;


function Radio() {
    ContentScalelessComponent.call(this);
}

Object.defineProperties(Radio.prototype, Object.getOwnPropertyDescriptors(ContentScalelessComponent.prototype));
Radio.prototype.constructor = Radio;
Radio.prototype.tag = "Radio";
Radio.prototype.menuIcon = "span.mdi.mdi-radiobox-marked";



Radio.prototype.create = function () {
    ContentScalelessComponent.prototype.preInit.call(this);
    this.style.width = 18;
    this.style.height = 18;
    this.style.vAlign = 'top';
    this.style.hAlign = 'left';
    this.style.textHAlign = 'center';
    this.style.textVAlign = 'center';
};


Radio.prototype.renderContent = function () {
    return _('radiobutton');
};


Radio.prototype.setAttributeChecked = function (value) {
    this.$content.checked = !!value;
    return this.$content;
};

Radio.prototype.setStyleWidth = function (value) {
    value = value >= 18 ? value : 18;
    return ContentScalelessComponent.prototype.setStyleWidth.call(this, value);
};


Radio.prototype.setStyleHeight = function (value) {
    value = value >= 18 ? value : 18;
    return ContentScalelessComponent.prototype.setStyleHeight.call(this, value);
};


export default Radio;