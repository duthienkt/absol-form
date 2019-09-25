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



Radio.prototype.preInit = function () {
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


Radio.prototype.handleAttributeChecked = function (value) {
    this.$content.checked = !!value;
};


Radio.prototype.handleStyleWidth = function (value) {
    this.style.width = value >= 18 ? value : 18;
    ContentScalelessComponent.prototype.handleStyleWidth.call(this, value);
};


Radio.prototype.handleStyleHeight = function (value) {
    this.style.height = value >= 18 ? value : 18;
    ContentScalelessComponent.prototype.handleStyleHeight.call(this, value);
};


export default Radio;