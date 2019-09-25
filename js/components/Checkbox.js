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

CheckBox.prototype.preInit = function () {
    ContentScalelessComponent.prototype.preInit.call(this);
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


CheckBox.prototype.handleAttributeChecked = function (value) {
    this.$content.checked = !!value;
};


CheckBox.prototype.handleStyleWidth = function (value) {
    this.style.width = value >= 18 ? value : 18;
    ContentScalelessComponent.prototype.handleStyleWidth.call(this, value);
};


CheckBox.prototype.handleStyleHeight = function (value) {
    this.style.height = value >= 18 ? value : 18;
    ContentScalelessComponent.prototype.handleStyleHeight.call(this, value);
};


export default CheckBox;