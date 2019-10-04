import Fcore from "../core/FCore";

import '../../css/component.css';
import ContentScalelessComponent from "../core/ContentScalelessComponent";

var _ = Fcore._;
var $ = Fcore.$;


function CheckBox() {
    ContentScalelessComponent.call(this);
}

Object.defineProperties(CheckBox.prototype, Object.getOwnPropertyDescriptors(ContentScalelessComponent.prototype));
CheckBox.prototype.constructor = CheckBox;
CheckBox.prototype.tag = "CheckBox";
CheckBox.prototype.menuIcon = "span.mdi.mdi-check-box-outline";

CheckBox.prototype.create = function () {
    ContentScalelessComponent.prototype.create.call(this);
    this.style.width = 18;
    this.style.height = 18;
    this.style.vAlign = 'top';
    this.style.hAlign = 'left';
    this.style.textHAlign = 'center';
    this.style.textVAlign = 'center';
};


CheckBox.prototype.renderContent = function () {
    return _('checkboxbutton');
};


CheckBox.prototype.setAttributeChecked = function (value) {
    this.$content.checked = !!value;
    return this.$content.checked;
};


CheckBox.prototype.setStyleWidth = function (value) {
    value = value >= 18 ? value : 18;
    return ContentScalelessComponent.prototype.setStyleWidth.call(this, value);
};


CheckBox.prototype.setStyleHeight = function (value) {
    value = value >= 18 ? value : 18;
    return ContentScalelessComponent.prototype.setStyleHeight.call(this, value);
};


export default CheckBox;