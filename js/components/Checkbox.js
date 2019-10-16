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

CheckBox.prototype.onCreate = function () {
    ContentScalelessComponent.prototype.onCreate.call(this);
    this.style.width = 18;
    this.style.height = 18;
    this.style.vAlign = 'top';
    this.style.hAlign = 'left';
    this.style.textHAlign = 'center';
    this.style.textVAlign = 'center';
    this.attributes.checked = false;
};


CheckBox.prototype.renderContent = function () {
    return _('checkboxbutton');
};

CheckBox.prototype.onCreated = function () {
    ContentScalelessComponent.prototype.onCreated.call(this);
    var self = this;
    this.view.on('change', function () {
        self.attributes.checked = this.checked;
    });
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



CheckBox.prototype.getAttributeCheckedDescriptor = function () {
    return {
        type: "bool"
    };
};


CheckBox.prototype.getAcceptsAttributeNames = function () {
    return ContentScalelessComponent.prototype.getAcceptsAttributeNames.call(this).concat(["checked"])
};


CheckBox.prototype.mesureMinSize = function () {
    return { width: 18, height: 18 };
};

export default CheckBox;