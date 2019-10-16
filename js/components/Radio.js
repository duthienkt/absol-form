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



Radio.prototype.onCreate = function () {
    ContentScalelessComponent.prototype.onCreate.call(this);
    this.style.width = 18;
    this.style.height = 18;
    this.style.vAlign = 'top';
    this.style.hAlign = 'left';
    this.style.textHAlign = 'center';
    this.style.textVAlign = 'center';
    this.style.checked = false;
};

Radio.prototype.onCreated = function () {
    ContentScalelessComponent.prototype.onCreated.call(this);
    var self = this;
    this.$content.on('change', function () {
        self.attributes.checked = this.checked;
    });
};


Radio.prototype.renderContent = function () {
    return _('radiobutton');
};


Radio.prototype.setAttributeChecked = function (value) {
    this.$content.checked = !!value;
    return this.$content.checked;
};

Radio.prototype.setStyleWidth = function (value) {
    value = value >= 18 ? value : 18;
    return ContentScalelessComponent.prototype.setStyleWidth.call(this, value);
};


Radio.prototype.setStyleHeight = function (value) {
    value = value >= 18 ? value : 18;
    return ContentScalelessComponent.prototype.setStyleHeight.call(this, value);
};


Radio.prototype.setAttributeGroupName = function (value) {
    this.$content.attr('name', value);
    return value;
};

Radio.prototype.getAttributeGroupNameDescriptor = function () {
    return {
        type: "text",
        regex: /[a-zA-Z0-9\_\-]+/
    };
};


Radio.prototype.getAttributeCheckedDescriptor = function () {
    return {
        type: "bool"
    };
};


Radio.prototype.getAcceptsAttributeNames = function () {
    return ContentScalelessComponent.prototype.getAcceptsAttributeNames.call(this).concat(["groupName", "checked"])
};


Radio.prototype.mesureMinSize = function () {
    return { width: 18, height: 18 };
};


export default Radio;